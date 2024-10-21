<template>
  <v-navigation-drawer :width="200">
    <v-list density="compact" nav>
      <v-list-item link prepend-icon="mdi-plus" title="Добавить трату" :to="{name: '/add-form'}" />
      <v-divider />
      <v-list-item link prepend-icon="mdi-table" title="Таблицы" :to="{name: '/tables'}" />
      <v-divider />
      <v-list-item link prepend-icon="mdi-finance" title="Диаграммы" :to="{name: '/diagrams'}" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">

</script>

<style scoped lang="css">

</style>
