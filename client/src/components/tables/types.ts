import { PaginationData, TransactionGroupPayload } from "@/types";

export enum TableTypes {
  TRANSACTION = "transaction",
  GROUP = "group",
  SUBGROUP = "subgroup",
}

export type TableTabs = {
  type: TableTypes;
  label: string;
  color?: string;
  icon?: string;
};

export const TableHeadersMap: { [key: string]: string } = {
  id: "ID",
  date: "Дата и время",
  groupid: "Группа",
  subgroupid: "Подгруппа",
  name: "Имя",
  description: "Описание",
  sum: "Сумма",
  group: "Группа",
  subgroup: "Подгруппа",
};

export type TableGroupItemData = {
  id: number;
  name: string;
  description?: string;
};

export type TableTransactionItemData = {
  id: number;
  date: string;
  name: string;
  group: TransactionGroupPayload;
  subgroup: TransactionGroupPayload;
  description?: string;
  sum: number;
  actions?: boolean;
};

export type TablePagination = PaginationData;

export type TableTransactionData = {
  items: TableTransactionItemData[];
  pagination?: TablePagination;
};

export type TableGroupData = {
  items: TableGroupItemData[];
  pagination?: TablePagination;
};

export type TableModalProps = {
  isVisible: boolean;
  mode: boolean;
  item?: TableTransactionItemData;
};
