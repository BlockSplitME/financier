<template>
  <v-container fluid>
    <v-row class="flex-nowrap">
      <v-col>
        <v-text-field
          v-model="form.name"
          label="Наименование"
          required
          variant="outlined"
          width="400px"
        />
        <group-field
          v-model="form.group"
          :groups="groups"
          label="Группа"
          @fetch-group="fetchGroup"
        />
        <group-field
          v-model="form.subgroup"
          :groups="subgroups"
          label="Подгруппа"
          @fetch-group="fetchSubgroups"
        />
      </v-col>
      <v-col>
        <DateField v-model="form.date" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          v-model="form.description"
          clearable
          label="Комментарий"
          no-resize
          variant="outlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <SumField v-model="form.sum" />
    </v-row>
    <v-row>
      <button-items :options="buttonsOptions" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  ButtonsOptions,
  CONSTANTS,
  CreateTransactionPayload,
  Domain,
  TableGroupItemData,
  TableTransactionItemData,
  TransactionGroupPayload,
} from "@/types";
import { api } from "@/api";
import DateField from "@/components/transaction-form/components/date-field.vue";
import { toast } from "vuetify-sonner";
import { AxiosError } from "axios";
import { PropType } from "vue";
import cloneProxy from "@/utils/cloneProxy";

const props = defineProps({
  domain: {
    type: String,
    required: true,
  },
  item: {
    type: Object as PropType<TableTransactionItemData>,
  },
  editorMode: Boolean,
});
const emits = defineEmits<{
  updateItem: [item: CreateTransactionPayload | null];
}>();

const groups = ref<TableGroupItemData[]>([]);
const subgroups = ref<TableGroupItemData[]>([]);
const isSubmitLoading = ref<boolean>(false);

const form = ref<CreateTransactionPayload>({
  name: "",
  date: new Date(),
  description: "",
  group: {
    name: "",
    description: "",
  },
  subgroup: {
    name: "",
    description: "",
  },
  sum: 0,
});

const buttonsOptions = computed<ButtonsOptions[]>(() => [
  {
    label: props.editorMode ? "редактировать" : "сохранить",
    action: props.editorMode
      ? () => updateTransaction()
      : () => addTransaction(),
    isLoading: isSubmitLoading.value,
  },
  {
    label: props.editorMode ? "отменить" : "очистить",
    action: props.editorMode
      ? () => updateTransaction(true)
      : () => resetForm(),
  },
]);

const fetchGroup = async () => {
  // TODO: Нет пагинации
  try {
    groups.value = (
      await api.getGroupsByDomain(props.domain as Domain, {
        name: form.value.group.name ?? "",
      })
    ).items;
    setGroupDescriptionByName(groups.value, form.value.group);
  } catch {}
};
const fetchSubgroups = async () => {
  // TODO: Нет пагинации
  try {
    subgroups.value = (
      await api.getSubgroupsByDomain(props.domain as Domain, {
        name: form.value.subgroup.name ?? "",
      })
    ).items;
    setGroupDescriptionByName(subgroups.value, form.value.subgroup);
  } catch {}
};
const setGroupDescriptionByName = (
  groups: TableGroupItemData[],
  formGroup: TransactionGroupPayload
) => {
  formGroup.description = groups.find(
    (group) => group.name === formGroup.name
  )?.description;
};

const addTransaction = () => {
  createTransaction();
};
const createTransaction = async () => {
  isSubmitLoading.value = true;
  try {
    await api.createTransaction(props.domain as Domain, form.value);
    toast.success("Успех", {
      description: "Транзакция добавлена",
    });
    resetForm();
  } catch (error) {
    toast.error("Ошибка добавления транзакции", {
      description: (error as AxiosError).message,
    });
  } finally {
    isSubmitLoading.value = false;
  }
};
const resetForm = () => {
  form.value = {
    name: "",
    date: form.value.date,
    description: "",
    group: {
      name: CONSTANTS.DEFAULT_GROUP_NAME as string,
      description: "",
    },
    subgroup: {
      name: CONSTANTS.DEFAULT_GROUP_NAME as string,
      description: "",
    },
    sum: 0,
  };
};
const updateTransaction = (isCancel?: boolean) => {
  emits("updateItem", isCancel ? null : form.value);
};

onMounted(async () => {
  await fetchGroup();
  form.value.group.name =
    groups.value.find((group) => group.name === CONSTANTS.DEFAULT_GROUP_NAME)
      ?.name ?? "";
  await fetchSubgroups();
  form.value.subgroup.name =
    subgroups.value.find((group) => group.name === CONSTANTS.DEFAULT_GROUP_NAME)
      ?.name ?? "";
  if (props.editorMode && props.item) {
    const cloneItem = cloneProxy(props.item);
    form.value = {
      name: cloneItem.name,
      date: new Date(cloneItem.date),
      description: cloneItem.description,
      group: {
        name: cloneItem.group.name,
        description: cloneItem.group.description,
      },
      subgroup: {
        name: cloneItem.subgroup.name,
        description: cloneItem.subgroup.description,
      },
      sum: cloneItem.sum,
    };
  }
});
</script>

<style scoped lang="css"></style>
