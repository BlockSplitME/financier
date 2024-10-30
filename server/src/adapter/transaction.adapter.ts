import {CreateTransactionPayload, GetTransactionResult} from "../types";
import {Group, Subgroup} from "../entity";

export const getTransactionsData = (data: any): GetTransactionResult =>
    ({
        id: data.id,
        date: data.date,
        name: data.name,
        group: data.group,
        subgroup: data.subgroup,
        description: data.description,
        sum: data.sum,
    })

export const createTransactionPayload = (data: CreateTransactionPayload, group: Group, subgroup: Subgroup): any  => ({
    date: data.date,
    name: data.name,
    group,
    subgroup,
    description: data.description ?? "",
    sum: data.sum,
})