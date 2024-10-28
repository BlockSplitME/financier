<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="name"
      :error-messages="name"
      label="Название"
    />

    <v-combobox
      :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
      label="Группа"
    />

    <v-combobox
      :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
      label="Подгруппа"
    />

    <v-text-field
      v-model="description"
      :error-messages="description"
      label="Комментарий"
    />

    <v-text-field
      v-model="sum"
      label="Сумма"
    />

    <v-btn
      class="me-4"
      type="submit"
    >
      submit
    </v-btn>

    <v-btn @click="handleReset">
      clear
    </v-btn>
  </form>
</template>

<script setup lang="ts">
  import { useForm }

 from 'vee-validate'
  import * as yup from 'yup'
  import { api }

 from '@/api'

  const { defineField } = useForm({
    validationSchema: yup.object({
      name: yup.string().required(),
      date: yup.date().required(),
      group: yup.string().required(),
      subgroup: yup.string().required(),
      description: yup.string(),
      sum: yup.number().required(),
    }),
  })

  const [name] = defineField('name')
  const [date] = defineField('date')
  const [group] = defineField('group')
  const [subgroup] = defineField('subgroup')
  const [description] = defineField('description')
  const [sum] = defineField('sum')

  const submit = () => {
    api.createExpense({
      date: date.value,
      description: description.value,
      group: group.value,
      name: name.value,
      subgroup: subgroup.value,
      sum: sum.value,
    })
  }

  const handlereset = () => {

  }
</script>

<style scoped lang="css">

</style>
