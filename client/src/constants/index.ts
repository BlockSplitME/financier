import { Domain, TableTabs, TableTypes } from '@/types'
import { TabsParams } from '@/components/domains-tabs/types'

export * from '@/api/consts'
export * from '@/router/consts'
export * from '@/components/tables/consts'

export const DOMAIN_TABS: TabsParams[] = [
  {
    value: Domain.EXPENSES,
    label: 'Расход',
    color: 'red',
    transition: true,
  },
  {
    value: Domain.INCOMES,
    label: 'Доход',
    color: 'green',
    transition: true,
  },
]

export const TABLES_TABS: TableTabs[] = [
  {
    type: TableTypes.TRANSACTION,
    label: 'Транзакции',
  },
  {
    type: TableTypes.GROUP,
    label: 'Группы',
  },
  {
    type: TableTypes.SUBGROUP,
    label: 'Подгруппы',
  },

]
