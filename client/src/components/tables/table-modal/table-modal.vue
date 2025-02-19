<template>
  <v-dialog
    v-if="item"
    v-model="isVisible"
    width="auto"
    max-width="900"
    persistent
  >
    <v-card class="pa-10 ga-4 align-center">
      <v-row>
        <span v-if="mode"
          >Уверены, что хотите удалить транзакцию
          <b>#{{ item?.id }}</b>
          ?</span
        >
        <transaction-form
          v-else
          :domain="props.domain"
          :item="item"
          editor-mode
          @update-item="updateItem"
        />
      </v-row>
      <v-row v-if="mode">
        <button-items :options="buttonsOptions" />
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  ButtonsOptions,
  CreateTransactionPayload,
  Domain,
  TableTransactionItemData,
} from "@/types";
import { api } from "@/api";
import { toast } from "vuetify-sonner";
import { AxiosError } from "axios";
import { PropType } from "vue";

const isVisible = defineModel<boolean>("modelValue", { required: true });
const props = defineProps({
  domain: {
    type: String,
    required: true,
  },
  item: {
    type: Object as PropType<TableTransactionItemData>,
  },
  mode: Boolean,
});
const emits = defineEmits<{
  close: [];
}>();

const isDeleteLoading = ref<boolean>(false);

const buttonsOptions = computed<ButtonsOptions[]>(() => [
  {
    label: "Удалить",
    action: () => {
      deleteItem();
      close();
    },
    isLoading: isDeleteLoading.value,
  },
  {
    label: "Отменить",
    action: () => close(),
  },
]);

const close = () => {
  emits("close");
};

const updateItem = async (item: CreateTransactionPayload | null) => {
  if (!item) {
    close();
    return;
  }
  try {
    if (props.item) {
      await api.updateTransaction(props.domain as Domain, props.item.id, item);
      toast.success("Успех", {
        description: `Транзакция ${props.item.id} изменена.`,
      });
      close();
    } else {
      throw new Error("Несуществующий id");
    }
  } catch (error) {
    toast.error("Ошибка удаления транзакции.", {
      description: (error as AxiosError).message,
    });
  }
};

const deleteItem = async () => {
  try {
    if (!props.item?.id) {
      throw new Error("Несуществующий id");
    }
    await api.deleteTransactionById(props.domain as Domain, props.item.id);
    toast.success("Успех", {
      description: `Транзакция ${props.item!.id} удалена`,
    });
  } catch (error) {
    toast.error("Ошибка удаления транзакции.", {
      description: (error as AxiosError).message,
    });
  }
};

onMounted(() => {});
</script>
<style scoped lang="css"></style>
