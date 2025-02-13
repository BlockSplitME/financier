<template>
  <v-btn-toggle
    v-model="tableType"
    borderless
    @update:model-value="changeTable"
  >
    <v-btn
      v-for="(tab, i) in TABLES_TABS"
      :key="i"
      :color="tab.color"
      :prepend-icon="tab.icon"
      :value="tab.type"
      variant="outlined"
    >{{ tab.label }}</v-btn>
  </v-btn-toggle>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    item-value="id"
    :items="tableItems"
    :items-length="totalItems"
    :loading="isLoading"
    @update:items-per-page="fetchTablesItems"
    @update:options="fetchTablesItems"
  >
    <template #[`item.group`]="{ item }">
      {{ (item as TableTransactionItemData).group.name }}
    </template>
    <template #[`item.subgroup`]="{ item }">
      {{ (item as TableTransactionItemData).subgroup.name }}
    </template>
  </v-data-table-server>
</template>

  <script lang="ts" setup>
  import {
    Domain,
    TableGroupItemData,
    TableHeadersMap, TablePagination, TableTransactionItemData,
    TableTypes,
  } from '@/types'
  import { api } from '@/api'
  import { ROW_COUNT, TABLES_TABS } from '@/constants'

  const props = defineProps({
    domain: {
      type: String,
      required: true,
    },
  })
  const itemsPerPage = ref<number>(ROW_COUNT)
  const isLoading = ref<boolean>(false)
  const tableType = ref<TableTypes>(TableTypes.TRANSACTION)
  const tablePagination = ref<TablePagination>()
  const tableItems = ref<TableGroupItemData[] | TableTransactionItemData[]>()
  const errorMessage = ref<string>('')

  const headers = computed<any[] | undefined>(() => {
    if (!tableItems.value || !tableItems.value.length) return
    return Object.keys(tableItems.value[0]).map(key =>
      ({
        title: TableHeadersMap[key],
        align: 'start',
        sortable: false,
        key,
      })
    )
  })
  const totalItems = computed<number>(() => tablePagination.value?.totalRows || 0)

  const changeTable = () => {
    fetchTablesItems({ page: 1, itemsPerPage: itemsPerPage.value })
  }

  const fetchTransactions = async (page: number, rowCount: number) => {
    const offset = (page - 1) * rowCount
    const { items, pagination } = await api.getTransactionsByDomain(props.domain as Domain, {
      rowCount: String(rowCount), offset: String(offset),
    })
    tableItems.value = items
    tablePagination.value = pagination
  }
  const fetchGroups = async (page: number, rowCount: number, isMain?: boolean) => {
    const offset = (page - 1) * rowCount
    const { items, pagination } = isMain
      ? await api.getGroupsByDomain(props.domain as Domain, { rowCount: String(rowCount), offset: String(offset) })
      : await api.getSubgroupsByDomain(props.domain as Domain, { rowCount: String(rowCount), offset: String(offset) })
    tableItems.value = items
    tablePagination.value = pagination
  }

  const fetchTablesItems = async (meta: any) => {
    const page: number = meta.page ?? 1
    const rowCount: number = meta.itemsPerPage ?? ROW_COUNT
    // TODO: Нет сортировки
    // const sortBy: any = meta.sortBy
    try {
      isLoading.value = true
      switch (tableType.value) {
        case TableTypes.TRANSACTION:
          await fetchTransactions(page, rowCount)
          break
        case TableTypes.GROUP:
          await fetchGroups(page, rowCount, true)
          break
        case TableTypes.SUBGROUP:
          await fetchGroups(page, rowCount)
          break
      }
    } catch (error) {
      errorMessage.value = 'Ошибка загрузки данных для таблицы'
    } finally {
      isLoading.value = false
    }
  }
  </script>

  <style lang="css" scoped />
