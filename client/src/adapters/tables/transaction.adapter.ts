import { GetTransactionsResult, TableTransactionData } from "@/types";

export default (payload: GetTransactionsResult): TableTransactionData => ({
  items: payload.data.map((item) => ({
    id: item.id,
    date: item.date,
    name: item.name,
    group: item.group,
    subgroup: item.subgroup,
    description: item.description,
    sum: item.sum,
    actions: true,
  })),
  pagination: payload.meta?.pagination,
});
