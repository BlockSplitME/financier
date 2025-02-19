<template>
  <v-app>
    <v-main class="d-flex flex-row layout__block-main">
      <Sidebar class="d-flex flex-column layout__block layout__block-sidebar" />
      <v-container class="pa-0" fluid>
        <v-sheet class="layout__block layout__block-page-content">
          <router-view />
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup></script>

<style scoped>
.layout__block {
  background-color: var(--var-layout-block-bg-color);
  border-radius: var(--var-border-radius-lg);
  height: fit-content;
}

.layout__block-main {
  background-color: var(--var-layout-bg-color);
  gap: var(--var-distance-lg);
  padding: var(--var-distance-lg) var(--var-distance-lg) var(--v-layout-bottom);
}

.layout__block-sidebar {
  width: 18em;
}

.layout__block-page-content {
  padding: var(--var-distance-lg);
  width: fit-content;
}
</style>
