import { AppDataSource } from "../../data-source"
import { NextFunction, Request, Response } from "express"
import { Expenses } from "./index"
import {Between, FindOptionsWhere} from "typeorm";

export class ExpensesResolver {

    private expensesRepository = AppDataSource.getRepository(Expenses)

    async getExpenses(request: Request, response: Response, next: NextFunction) {
        const { id, start_timestamp, end_timestamp, name, group, subgroup  } = request.query;
        const whereConditions =  {} as FindOptionsWhere<Expenses>;

        if (id) whereConditions.id = Number(id);
        if (start_timestamp || end_timestamp) {
            whereConditions.date = Between<Date>(start_timestamp ? new Date(start_timestamp as string) : new Date(0), end_timestamp ? new Date(end_timestamp as string) : new Date());
        }
        if (name) whereConditions.name = name as string;
        if (group) whereConditions.group = group as string;
        if (subgroup) whereConditions.subgroup = subgroup as string;
        try {
            const data = await this.expensesRepository.find({where: whereConditions});
            if(data.length === 0) {
                response.status(404).json({ error: 'Данных по данномму запросу не найдено.' });
            } else {
                response.status(200).json(data);
            }
        } catch(error) {
            response.status(500).json({ error: 'Ошибка подключения к базе данных.' });
            console.error('Ошибка подключения к базе данных:', error);
        }
    }
    async createExpense(request: Request, response: Response, next: NextFunction) {
        const requestBody = request.body as Expenses;

        const hasUndefinedField = Object.values(requestBody).some(value => value === undefined);

        if (hasUndefinedField) {
            response.status(400).json({ error: 'Не хватает необходимых полей.' });
        } else {
            const newItem = this.expensesRepository.create(requestBody);
            try {
                await this.expensesRepository.save(newItem);
                response.status(201).json(newItem);
            } catch (error) {
                response.status(500).json({ error: 'Ошибка подключения к базе данных.' });
                console.error('Ошибка подключения к базе данных:', error);
            }
        }
    }
    async deleteExpense(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id
        try {
            const res = await this.expensesRepository.delete({id: Number(id)});
            if(res.affected == 0) {
                response.status(200).json({message: `Элемент по id ${id} не найден.`});
            } else {
                response.status(200).json({message: `Элемент по id ${id} удален.`});
            }
        } catch(error) {
            response.status(500).json({ error: 'Ошибка подключения к базе данных.' });
            console.error('Ошибка подключения к базе данных:', error);
        }
    }
    async updateExpense(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id;
        const requestBody = request.body as Expenses;

        const hasUndefinedField = Object.values(requestBody).some(value => value === undefined);

        if (hasUndefinedField) {
            response.status(400).json({ error: 'Не хватает необходимых полей.' });
        } else {
            try {
                await this.expensesRepository.update({id: Number(id) }, requestBody);
                response.status(200).json(requestBody);
            } catch (error) {
                response.status(500).json({ error: 'Ошибка подключения к базе данных.' });
                console.error('Ошибка подключения к базе данных:', error);
            }
        }
    }
}