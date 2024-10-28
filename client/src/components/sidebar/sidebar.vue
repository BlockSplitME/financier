<template>
  <v-list density="compact" nav>
    <template
      v-for="(item, i) in sidebarItems"
      :key="i"
    >
      <v-list-item
        :append-icon="item.icon"
        class="sidebar__list-item ma-0"
        link
        :title="item.label"
        :to="item.route"
      />
      <v-divider v-if="i < sidebarItems.length - 1" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
  import { ROUTE_DIAGRAMS_PATH, ROUTE_HOME_PATH, ROUTE_TABLES_PATH }

 from '@/constants'
  import { ISidebarItem } from '@/types'

  const sidebarItems: ISidebarItem[] = [
    {
      route: ROUTE_HOME_PATH,
      icon: 'mdi-plus',
      label: 'Добавить трату',
    },
    {
      route: ROUTE_TABLES_PATH,
      icon: 'mdi-table',
      label: 'Таблицы',
    },
    {
      route: ROUTE_DIAGRAMS_PATH,
      icon: 'mdi-finance',
      label: 'Диаграммы',
    },
  ]
</script>

<style scoped lang="css">
.sidebar__list-item {
}
</style>
