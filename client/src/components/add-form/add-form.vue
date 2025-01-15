<template>
  <form ref="formRef" @submit.prevent="handleSubmit">
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
          <group-field v-model="form.group" :groups="groups" label="Группа" @fetch-group="fetchGroup" />
          <group-field v-model="form.subgroup" :groups="subgroups" label="Подгруппа" @fetch-group="fetchSubgroups" />
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
        <v-btn
          class="me-4"
          type="submit"
        >
          Сохранить
        </v-btn>
        <v-btn @click="resetForm">
          Очистить
        </v-btn>
      </v-row>
    </v-container>
  </form>
</template>

<script setup lang="ts">
  import { CONSTANTS, CreateTransactionPayload, Domain, TableGroupItemData, TransactionGroupPayload } from '@/types'
  import { api } from '@/api'
  import DateField from '@/components/add-form/components/date-field.vue'

  const props = defineProps({
    domain: {
      type: String,
      required: true,
    },
  })

  const formRef = ref()
  const groups = ref<TableGroupItemData[]>([])
  const subgroups = ref<TableGroupItemData[]>([])

  const form = ref<CreateTransactionPayload>({
    name: '',
    date: new Date(),
    description: '',
    group: {
      name: '',
      description: '',
    },
    subgroup: {
      name: '',
      description: '',
    },
    sum: 0,
  })

  const fetchGroup = async () => {
    // TODO: Нет пагинации
    try {
      groups.value = (await api.getGroupsByDomain(props.domain as Domain, { name: form.value.group.name ?? '' })).items
      setGroupDescriptionByName(groups.value, form.value.group)
    } catch {}
  }
  const fetchSubgroups = async () => {
    // TODO: Нет пагинации
    try {
      subgroups.value = (await api.getSubgroupsByDomain(props.domain as Domain, { name: form.value.subgroup.name ?? '' })).items
      setGroupDescriptionByName(subgroups.value, form.value.subgroup)
    } catch {}
  }
  const setGroupDescriptionByName = (groups: TableGroupItemData[], formGroup: TransactionGroupPayload) => {
    formGroup.description = groups.find(group => group.name === formGroup.name)?.description
  }

  const handleSubmit = async () => {
    await api.createTransaction(props.domain as Domain, form.value)
  }
  const resetForm = () => {
    form.value = {
      name: '',
      date: form.value.date,
      description: '',
      group: {
        name: CONSTANTS.DEFAULT_GROUP_NAME as string,
        description: '',
      },
      subgroup: {
        name: CONSTANTS.DEFAULT_GROUP_NAME as string,
        description: '',
      },
      sum: 0,
    }
  }
  onMounted(async () => {
    await fetchGroup()
    form.value.group.name = groups.value.find(group => group.name === CONSTANTS.DEFAULT_GROUP_NAME)?.name ?? ''
    await fetchSubgroups()
    form.value.subgroup.name = subgroups.value.find(group => group.name === CONSTANTS.DEFAULT_GROUP_NAME)?.name ?? ''
  })
</script>

<style scoped lang="css">
</style>
