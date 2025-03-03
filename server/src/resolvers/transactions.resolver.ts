import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {Expenses, Group, Incomes, Subgroup} from "../entity"
import { Repository} from "typeorm";
import {
    CONSTANTS,
    CreateTransactionPayload,
    Domain,
    GetGroupParams,
    GetTransactionParams, GetTransactionsResult, GroupType, UpdateGroupPayload,
    UpdateTransactionPayload
} from "../types";
import {BadRequestError, InternalServerError, NotFoundError} from "../utils";
import { transactionAdapter } from "../adapter";

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
    private async _createGroup(groupType: GroupType, next: NextFunction, name?: string, isIncome: boolean = false, description?: string ): Promise<Group> {
        const repository = this._selectRepository(groupType, next);
        if(!name && !name.trim()) next(new BadRequestError(`Передана ${groupType} без имени`));
        else {
            try {
                const newItem = repository.create({
                    name: name.toLowerCase().trim(),
                    description: description || '',
                    isIncome,
                });
                await repository.save(newItem);

                return newItem;
            } catch (error) {
                next(new InternalServerError(`Ошибка создания новой ${groupType}`));
            }
        }
    }
    private async _getGroup(groupType: GroupType, next: NextFunction, name: string, isIncome: boolean): Promise<Group | undefined> {
        const repository = this._selectRepository(groupType, next);
        return await repository.findOne({ where: {name, isIncome}});
    }
    private async _getTransactionsByDomain(domain: Domain, params: GetTransactionParams, next: NextFunction): Promise<GetTransactionsResult> {
        const repository = this._selectRepository(domain, next);
        const queryBuilder = repository.createQueryBuilder("transaction");
        const isIncome = domain === Domain.INCOMES;

        const {
            id,
            start_date,
            end_date,
            name,
            groupName,
            subgroupName,
            offset,
            rowCount,
            sortBy,
            sortOrder,
            sortNulls
        } = params;

        if (id) {
            queryBuilder.andWhere("transaction.id = :id", { id: Number(id)})
        }
        if (start_date || end_date) {
            queryBuilder.andWhere("transaction.date BETWEEN :startDate AND :endDate", { start_date: start_date ? new Date(start_date as string) : new Date(0), end_date: end_date ? new Date(end_date as string) : new Date() })
        }
        if (name) {
            queryBuilder.andWhere("transaction.name = :name", { name })
        }
        if (groupName) {
            const group: Group = await this._getGroup(GroupType.GROUP, next, groupName as string, isIncome);
            if(group) {
                queryBuilder.andWhere("transaction.group = :group", { group })
            } else next(new NotFoundError("Не найдена группа"));
        }
        if (subgroupName) {
            const subgroup: Subgroup = await this._getGroup(GroupType.SUBGROUP, next, subgroupName as string, isIncome);
            if(subgroup) {
                queryBuilder.andWhere("transaction.subgroup = :subgroup", { subgroup })
            } else next(new NotFoundError("Не найдена подгруппа"));
        }

        const totalRows = await queryBuilder.getCount();
        const skip = Number(offset ?? 0);

        queryBuilder.leftJoinAndSelect("transaction.group", "group")
        queryBuilder.leftJoinAndSelect("transaction.subgroup", "subgroup")
        queryBuilder
            .skip(Number(offset ?? 0))
            .take(Number(rowCount ?? CONSTANTS.DEFAULT_ROW_COUNT))

        if(sortBy) {
            queryBuilder.orderBy(`transaction.${sortBy}`, sortOrder, sortNulls)
        }
        // else {
        //     queryBuilder.orderBy(`transaction.update_date`, "ASC", "NULLS FIRST")
        // }

        const data = await queryBuilder.getMany()
        return {
            data,
            meta: {
                pagination: {
                    offset: skip,
                    rowCount: data.length,
                    totalRows
                }
            }
        }
    }

    async getTransactionsByDomain(request: Request, response: Response, next: NextFunction) {
        const data = await this._getTransactionsByDomain(request.params.domain as Domain, request.query as GetTransactionParams, next);
        if(!data) {
            response.status(404).json({ data: []});
        } else {
            response.status(200).json(data);
        }
    }
    async createTransaction(request: Request, response: Response, next: NextFunction) {
        const repository = this._selectRepository(request.params.domain as Domain, next);
        const requestBody: CreateTransactionPayload = request.body;
        const isIncome = request.params.domain === Domain.INCOMES;

        const isCorrectInputData = Boolean(
            requestBody.name &&
            requestBody.name.trim() &&
            requestBody.date &&
            requestBody.sum >= 0);
        if (isCorrectInputData) {
            const group = await this._getGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome) ?? await this._createGroup(GroupType.GROUP, next, requestBody.group.name as string, isIncome, requestBody.group.description as string);
            const subgroup = await this._getGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome) ?? await this._createGroup(GroupType.SUBGROUP, next, requestBody.subgroup.name as string, isIncome, requestBody.subgroup.description as string);
            if(group && subgroup) {
                const newItem = repository.create(transactionAdapter.createTransactionPayload(requestBody, group, subgroup, new Date()));
                await repository.save(newItem);

                const data = await repository.findOne({where: {id: newItem.id}, relations: ['group', 'subgroup']});
                if(!data) {
                    next(new InternalServerError("Ошибка сохранения"))
                } else {
                    response.status(201).json(transactionAdapter.getTransactionData(data))
                }
            }
        } else {
            next(new BadRequestError('Не хватает необходимых полей.'))
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
            await repository.update({id: Number(id)}, {
                ...requestBody,
                update_date: new Date()
            });
            const data = await repository.findOne({where: {id}, relations: ['group', 'subgroup']});
            response.status(200).json(transactionAdapter.getTransactionData(data))
        } else {
            next(new BadRequestError(`Не существует элемента по id=${id}`))
        }
    }

    async getGroups(request: Request, response: Response, next: NextFunction, groupType: GroupType = GroupType.GROUP) {
        const repository = this._selectRepository(groupType, next);
        const queryBuilder = repository.createQueryBuilder("group");

        const {
            name,
            offset,
            rowCount,
            sortBy,
            sortOrder,
            sortNulls
        } = request.query as GetGroupParams;

        queryBuilder.andWhere("group.isIncome = :isIncome", { isIncome: request.params.domain === Domain.INCOMES})
        if (name) {
            queryBuilder.andWhere("group.name LIKE :name", { name: `${name.toLowerCase().trim()}%` });
        }

        const totalRows = await queryBuilder.getCount();
        const skip = Number(offset ?? 0);

        queryBuilder
            .skip(Number(offset ?? 0))
            .take(Number(rowCount ?? CONSTANTS.DEFAULT_ROW_COUNT))

        if(sortBy) {
            queryBuilder.orderBy(`group.${sortBy}`, sortOrder, sortNulls)
        }

        const data = await queryBuilder.getMany();

        if(data.length === 0) {
            response.status(404).json([]);
        } else {
            response.status(200).json({
                data,
                meta: {
                    pagination: {
                        offset: skip,
                        rowCount: data.length,
                        totalRows
                    }
                }
            });
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