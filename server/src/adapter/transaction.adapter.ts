import {CreateTransactionPayload, GetTransactionData, GetTransactionsResult, PaginationData} from "../types";
import {Group, Subgroup} from "../entity";

export const transactionAdapter = {
    getTransactionData (data: any): GetTransactionData {
        return {
            id: data.id,
            date: data.date,
            name: data.name,
            group: data.group,
            subgroup: data.subgroup,
            description: data.description,
            sum: data.sum,
        }
    },

    createTransactionPayload (data: CreateTransactionPayload, group: Group, subgroup: Subgroup): any {
        return {
            date: data.date,
            name: data.name,
            group,
            subgroup,
            description: data.description ?? "",
            sum: data.sum,
        }
    }
}