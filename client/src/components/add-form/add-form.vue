<template>
  <form @submit.prevent="submit">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.name"
            label="Наименование"
            variant="outlined"
            width="400px"
          />
          <group-field v-model="form.group" :groups="groups" @fetch-group="fetchGroup" />
          <group-field v-model="form.subgroup" :groups="subgroups" @fetch-group="fetchSubgroups" />
        </v-col>
        <v-col>
          <v-date-picker
            v-model="form.date"
            elevation="5"
            height="465px"
            :max="maxDatePicker"
            width="350px"
          />
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
        <v-col>
          <v-btn
            class="me-4"
            type="submit"
          >
            submit
          </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="handleReset">
            clear
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script setup lang="ts">
  import { CreateTransactionPayload, Domain, Group, Subgroup } from '@/types'
  import { api } from '@/api'
  import { formatDate } from '@/utils/format-date'
  import GroupField from '@/components/add-form/components/group-field.vue'

  const props = defineProps({
    domain: {
      type: String,
      required: true,
    },
  })

  const groups = ref<Group[]>([])
  const subgroups = ref<Subgroup[]>([])

  const maxDatePicker = formatDate.getDateForDatePicker(Date.now())

  const form = ref<CreateTransactionPayload>({
    name: '',
    date: new Date(),
    description: 'dsdsdsddssds',
    group: {
      name: '',
      description: 'Описание',
    },
    subgroup: {
      name: '',
      description: 'Описание',
    },
    sum: 0,
  })

  const fetchGroup = async (name: string = '') => {
    groups.value = await api.getGroupsByDomain(props.domain as Domain, { name })
  }
  const fetchSubgroups = async (name: string = '') => {
    subgroups.value = await api.getSubgroupsByDomain(props.domain as Domain, { name })
  }

  const submit = () => {

  }
  const handleReset = () => {

  }
  onMounted(() => {
    fetchGroup()
    fetchSubgroups()
  })
</script>

<style scoped lang="css">
</style>
