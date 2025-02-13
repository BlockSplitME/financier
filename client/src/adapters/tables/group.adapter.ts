import { GetGroupResult, TableGroupData } from '@/types'

export default (payload: GetGroupResult): TableGroupData => ({
  items: payload.data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
  })),
  pagination: payload.meta?.pagination,
})
