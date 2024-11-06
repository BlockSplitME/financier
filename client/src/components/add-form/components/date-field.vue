<template>
  <v-date-picker
    v-model="date"
    elevation="5"
    height="465px"
    :max="maxDatePicker"
    min="2024-01-01"
    width="350px"
    @update:model-value="updateDate"
  />
</template>

<script setup lang="ts">
  import { formatDate } from '@/utils'

  const date = defineModel<Date>('modelValue', {
    type: Date,
    required: true,
  })

  const maxDatePicker = formatDate.getDateForDatePicker(Date.now())

  const updateDate = () => {
    console.log(date.value)
  }
</script>

<style scoped lang="css">

</style>
