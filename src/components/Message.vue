<template>
  <v-card>
    <v-card-title> {{msg}}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  defineProps<{ msg: string }>()

</script>

<style scoped>

</style>
