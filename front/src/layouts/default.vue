<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  //
  import AppFooter from '@/components/AppFooter.vue'
</script>
