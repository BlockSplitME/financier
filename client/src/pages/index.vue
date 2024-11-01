<template>
  <v-tabs
    v-model="tab"
    align-tabs="start"
    class="pl-1"
  >
    <v-tab
      v-for="(item, i) in tabs"
      :key="i"
      :color="item.color"
      :text="item.label"
      :value="item.value"
    />
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="(item, i) in tabs"
      :key="i"
      :reverse-transition="item.transition"
      :transition="item.transition"
      :value="item.value"
    >
      <AddForm :domain="item.value" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
  import { Domain } from '@/types'

  const tab = ref()
  const tabs = [
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
</script>

<style scoped lang="css">

</style>
