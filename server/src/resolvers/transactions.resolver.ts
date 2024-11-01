import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {Expenses, Group, Incomes, Subgroup} from "../entity"
import {Between, FindOptionsWhere, Like, Repository} from "typeorm";
import {
    CreateTransactionPayload,
    Domain,
    GetGroupParams,
    GetTransactionParams, GroupType, TransactionGroupPayload, UpdateGroupPayload,
    UpdateTransactionPayload
} from "../types";
import {BadRequestError, InternalServerError, NotFoundError} from "../utils";
import {createTransactionPayload, getTransactionsData} from "../adapter";

export class TransactionsResolver {

    private expensesRepository = AppDataSource.getRepository(Expenses)
    private incomesRepository = AppDataSource.getRepository(Incomes)
    private groupRepository = AppDataSource.getRepository(Group)
    private subgroupRepository = AppDataSource.getRepository(Subgroup)

    private _selectRepository = (domain: Domain | GroupType, next: NextFunction): Repository<any> => {
        switch(domain) {
            case Domain.INCOMES:
                return this.incomesRepository
            case Domain.EXPENSES:
                return this.expensesRepository
            case GroupType.GROUP:
                return this.groupRepository
            case GroupType.SUBGROUP:
                return this.subgroupRepository
            default:
                next(new BadRequestError("Передан неизвестный domain"));
        }
    }
    private async _createGroup(groupType: GroupType, next: NextFunction, name: string, isIncome: boolean = false, description?: string ): Promise<Group> {
        const repository = this._selectRepository(groupType, next);
        try {
            const newItem = repository.create({
                name,
                description: description || '',
                isIncome,
            });
            await repository.save(newItem);

            return newItem;
        } catch (error) {
            next(new InternalServerError(`Ошибка создания новой ${groupType}`));
        }
    }
    private async _getGroup(groupType: GroupType, next: NextFunction, name: string, isIncome: boolean): Promise<Group | undefined> {
        const repository = this._selectRepository(groupType, next);
        return await repository.findOne({ where: {name, isIncome}});
    }
    private async _getTransactionsByDomain(domain: Domain, params: GetTransactionParams, next: NextFunction) {
        const repository = this._selectRepository(domain, next);
        const isIncome = domain === Domain.INCOMES;

        const whereConditions =  {} as FindOptionsWhere<Expenses>;
        const { id, start_timestamp, end_timestamp, name, groupName, subgroupName} = params;

        if (id) whereConditions.id = Number(id);
        if (start_timestamp || end_timestamp) {
            whereConditions.date = Between<Date>(start_timestamp ? new Date(start_timestamp as string) : new Date(0), end_timestamp ? new Date(end_timestamp as string) : new Date());
        }
        if (name) whereConditions.name = name as string;
        if (groupName) {
            const group: Group = await this._getGroup(GroupType.GROUP, next, groupName as string, isIncome);
            if(group) whereConditions.group = group;
            else next(new NotFoundError("Не найдена группа"));
        }
        if (subgroupName) {
            const subgroup: Subgroup = await this._getGroup(GroupType.SUBGROUP, next, subgroupName as string, isIncome);
            if(subgroup) whereConditions.subgroup = subgroup;
            else next(new NotFoundError("Не найдена подгруппа"));
        }
        return await repository.find({where: whereConditions, relations: ['group', 'subgroup']});
    }

    async getTransactionsByDomain(request: Request, response: Response, next: NextFunction) {
        const data = await this._getTransactionsByDomain(request.params.domain as Domain, request.query as GetTransactionParams, next);
        if(data.length === 0) {
            response.status(404).json([]);
        } else {
            response.status(200).json(data.map((item) => getTransactionsData(item)));
        }
    }
    async createTransaction(request: Request, response: Response, next: NextFunction) {
        const repository = this._selectRepository(request.params.domain as Domain, next);
        const requestBody: CreateTransactionPayload = request.body;
        const isIncome = request.params.domain === Domain.INCOMES;

        //TODO: Проверить на работоспособность
        const hasUndefinedField = Object.values(requestBody).some(value => value === undefined);

        if (hasUndefinedField) {
            next(new BadRequestError('Не хватает необходимых полей.'))
        } else {
            const group = await this._getGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome) ?? await this._createGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome, requestBody.group.description as string);
            const subgroup = await this._getGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome) ?? await this._createGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome, requestBody.subgroup.description as string);
            if(group && subgroup) {
                const newItem = repository.create(createTransactionPayload(requestBody, group, subgroup));
                await repository.save(newItem);

                const data = await repository.findOne({where: {id: newItem.id}, relations: ['group', 'subgroup']});
                if(!data) {
                    next(new InternalServerError("Ошибка сохранения"))
                } else {
                    response.status(201).json(getTransactionsData(data))
                }
            }
        }
    }
    async deleteTransaction(request: Request, response: Response, next: NextFunction) {
        const repository = this._selectRepository(request.params.domain as Domain, next);
        const id = request.params.id

        const res = await repository.delete({id: Number(id)});
        if(res.affected == 0) {
            response.status(200).json({message: `Элемент по id ${id} не найден.`});
        } else {
            response.status(200).json({message: `Элемент по id ${id} удален.`});
        }
    }
    async updateTransaction(request: Request, response: Response, next: NextFunction) {
        const repository = this._selectRepository(request.params.domain as Domain, next);
        const id = request.params.id;
        const requestBody: UpdateTransactionPayload = request.body;
        const isIncome = request.params.domain === Domain.INCOMES;

        if(requestBody.group) {
            requestBody.group = await this._getGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome) ?? await this._createGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome, requestBody.group.description as string);
        }
        if(requestBody.subgroup) {
            requestBody.subgroup = await this._getGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome) ?? await this._createGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome, requestBody.subgroup.description as string);
        }
        const isItemExists = await repository.exists({where:{id}});
        if(isItemExists) {
            await repository.update({id: Number(id)}, requestBody);
            const data = await repository.findOne({where: {id}, relations: ['group', 'subgroup']});
            response.status(200).json(getTransactionsData(data))
        } else {
            next(new BadRequestError(`Не существует элемента по id=${id}`))
        }
    }

    async getGroups(request: Request, response: Response, next: NextFunction, groupType: GroupType = GroupType.GROUP) {
        const repository = this._selectRepository(groupType, next);
        const { name } = request.query as GetGroupParams;

        const whereConditions =  {
            isIncome: request.params.domain === Domain.INCOMES,
        } as FindOptionsWhere<Group>;

        if(name) {
            whereConditions.name = Like(`${name}%`);
        }
        const data = await repository.find({where: whereConditions});
        if(data.length === 0) {
            response.status(404).json([]);
        } else {
            response.status(200).json(data);
        }
    }
    async getSubgroups(request: Request, response: Response, next: NextFunction) {
        await this.getGroups(request, response, next, GroupType.SUBGROUP);
    }
    async updateGroup(request: Request, response: Response, next: NextFunction, groupType: GroupType = GroupType.GROUP) {
        const repository = this._selectRepository(groupType, next);
        const id = request.params.id;
        const requestBody: UpdateGroupPayload = request.body;

        const isItemExists = await repository.exists({where: {id, isIncome: request.params.domain === Domain.INCOMES}});
        if(isItemExists) {
            await repository.update({id: Number(id)}, requestBody);
            const data = await repository.findOne({where: {id}});
            response.status(200).json(data)
        } else {
            next(new BadRequestError(`Не существует элемента по id=${id} из ${groupType}=${request.params.domain}`))
        }
    }
    async updateSubgroup(request: Request, response: Response, next: NextFunction) {
        await this.updateGroup(request, response, next, GroupType.SUBGROUP);
    }
}