export type DeepPartial<T> = T extends object ? {
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
    DEFAULT_GROUP_NAME = 'не выбрана',
    DEFAULT_ROW_COUNT = 20
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
    start_date?: string;
    end_date?: string;
    name?: string;
    groupName?: string;
    subgroupName?: string;
    offset?: string;
    rowCount?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    sortNulls?: "NULLS FIRST" | "NULLS LAST"
}

export type Group = {
    id: number;
    name: string;
    isIncome: boolean;
    description?: string
}

export type Subgroup = Group;

export type GetTransactionData = Omit<CreateTransactionPayload, "group" | "subgroup"> & {
    id: number,
    group: Group;
    subgroup: Subgroup;
}

export type PaginationData = {
    offset: number;
    rowCount: number;
    totalRows: number;
}

export type GetTransactionsMeta = {
    pagination: PaginationData
}

export type GetTransactionsResult = {
    data: GetTransactionData[];
    meta?: GetTransactionsMeta
}

export type GetGroupResult = {
    data: Group[];
    meta?: GetTransactionsMeta
}

export type UpdateTransactionPayload = DeepPartial<GetTransactionData>;

export type GetGroupParams = {
    name?: string;
    offset?: string;
    rowCount?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    sortNulls?: "NULLS FIRST" | "NULLS LAST"
}

export type UpdateGroupPayload = Partial<TransactionGroupPayload>;