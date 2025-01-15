import { GetTransactionsResult, TableTransactionData } from '@/types'
import { formatDate } from '@/utils'

export default (payload: GetTransactionsResult): TableTransactionData => ({
  items: payload.data.map(item => ({
    id: item.id,
    date: formatDate.getDateForTable(item.date),
    name: item.name,
    group: item.group,
    subgroup: item.subgroup,
    description: item.description,
    sum: item.sum,
  })),
  pagination: payload.meta?.pagination,
})
