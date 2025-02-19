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
      >{{ tab.label }}</v-btn
    >
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
    <template #[`item.date`]="{ item }">
      {{ parseDate((item as TableTransactionItemData).date) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="clickItem(item as TableTransactionItemData)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="clickItem(item as TableTransactionItemData, true)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table-server>
  <table-modal
    v-model="tableModalProps.isVisible"
    :domain="domain"
    :item="tableModalProps.item"
    :mode="tableModalProps.mode"
    @close="closeModal"
  ></table-modal>
</template>

<script lang="ts" setup>
import {
  Domain,
  TableGroupItemData,
  TableHeadersMap,
  TableModalProps,
  TablePagination,
  TableTransactionItemData,
  TableTypes,
} from "@/types";
import { api } from "@/api";
import { ROW_COUNT, TABLES_TABS } from "@/constants";
import { toast } from "vuetify-sonner";
import { AxiosError } from "axios";
import { formatDate } from "@/utils";

const props = defineProps({
  domain: {
    type: String,
    required: true,
  },
});
const isLoading = ref<boolean>(false);
const tableType = ref<TableTypes>(TableTypes.TRANSACTION);
const tablePagination = ref<TablePagination>();
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(ROW_COUNT);

const tableItems = ref<TableGroupItemData[] | TableTransactionItemData[]>();
const errorMessage = ref<string>("");
const tableModalProps = ref<TableModalProps>({
  isVisible: false,
  mode: false,
});
const headers = computed<any[] | undefined>(() => {
  if (!tableItems.value || !tableItems.value.length) return;
  return Object.keys(tableItems.value[0]).map((key) => ({
    title: TableHeadersMap[key],
    align: "start",
    sortable: false,
    key,
  }));
});
const totalItems = computed<number>(
  () => tablePagination.value?.totalRows || 0
);

const parseDate = (date: string | Date) => formatDate.getDateForTable(date);

const changeTable = () => {
  fetchTablesItems({ page: 1, itemsPerPage: itemsPerPage.value });
};
const closeModal = () => {
  tableModalProps.value.isVisible = false;
  setTimeout(
    () =>
      fetchTablesItems({
        page: currentPage.value ?? 1,
        itemsPerPage: itemsPerPage.value ?? ROW_COUNT,
      }),
    1000
  );
};
const fetchTransactions = async (page: number, rowCount: number) => {
  const offset = (page - 1) * rowCount;
  const { items, pagination } = await api.getTransactionsByDomain(
    props.domain as Domain,
    {
      rowCount: String(rowCount),
      offset: String(offset),
    }
  );
  tableItems.value = items;
  tablePagination.value = pagination;
};
const fetchGroups = async (
  page: number,
  rowCount: number,
  isMain?: boolean
) => {
  const offset = (page - 1) * rowCount;
  const { items, pagination } = isMain
    ? await api.getGroupsByDomain(props.domain as Domain, {
        rowCount: String(rowCount),
        offset: String(offset),
      })
    : await api.getSubgroupsByDomain(props.domain as Domain, {
        rowCount: String(rowCount),
        offset: String(offset),
      });
  tableItems.value = items;
  tablePagination.value = pagination;
};

const fetchTablesItems = async (meta: any) => {
  currentPage.value = meta.page ?? 1;
  itemsPerPage.value = meta.itemsPerPage ?? ROW_COUNT;
  // TODO: Нет сортировки
  // const sortBy: any = meta.sortBy
  try {
    isLoading.value = true;
    switch (tableType.value) {
      case TableTypes.TRANSACTION:
        await fetchTransactions(currentPage.value, itemsPerPage.value);
        break;
      case TableTypes.GROUP:
        await fetchGroups(currentPage.value, itemsPerPage.value, true);
        break;
      case TableTypes.SUBGROUP:
        await fetchGroups(currentPage.value, itemsPerPage.value);
        break;
    }
  } catch (error) {
    errorMessage.value = "Ошибка загрузки данных для таблицы";
    toast.error(`Ошибка загрузки данных для таблицы (${tableType.value})`, {
      description: (error as AxiosError).message,
    });
  } finally {
    isLoading.value = false;
  }
};
const clickItem = async (
  item: TableTransactionItemData,
  mode: boolean = false
) => {
  tableModalProps.value = {
    mode,
    item,
    isVisible: true,
  };
};
</script>

<style lang="css" scoped />
