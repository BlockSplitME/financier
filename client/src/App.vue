<template>
  <v-app>
    <VSonner position="bottom-center" :visible-toasts="3" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
import { VSonner } from "vuetify-sonner";
</script>
