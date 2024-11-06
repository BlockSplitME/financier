type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export enum Domain {
    INCOMES = 'incomes',
    EXPENSES = 'expenses',
}

export enum GroupType {
    GROUP = 'group',
    SUBGROUP = 'subgroup',
}

export enum CONSTANTS {
    DEFAULT_GROUP_NAME = 'не выбрана'
}

export type TransactionGroupPayload = {
    name: string;
    description?: string;
}

export type CreateTransactionPayload = {
    date: Date;
    name: string;
    group: TransactionGroupPayload;
    subgroup: TransactionGroupPayload;
    description?: string;
    sum: number;
}

export type GetTransactionParams = {
    id?: string;
    start_timestamp?: string;
    end_timestamp?: string;
    name?: string;
    groupName?: string;
    subgroupName?: string;
}

export type Group = {
    id: number;
    name: string;
    isIncome: boolean;
    description?: string
}

export type Subgroup = Group;

export type GetTransactionResult = Omit<CreateTransactionPayload, "group" | "subgroup"> & {
    id: number,
    group: Group;
    subgroup: Subgroup;
}

export type UpdateTransactionPayload = DeepPartial<GetTransactionResult>;

export type GetGroupParams = {
    name: string;
}

export type UpdateGroupPayload = Partial<TransactionGroupPayload>;