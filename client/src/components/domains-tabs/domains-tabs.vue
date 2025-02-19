<template>
  <v-tabs v-model="tab" align-tabs="start" class="pl-1">
    <v-tab
      v-for="(item, i) in DOMAIN_TABS"
      :key="i"
      :color="item.color"
      :text="item.label"
      :value="item.value"
    />
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="(item, i) in DOMAIN_TABS"
      :key="i"
      :reverse-transition="item.transition"
      :transition="item.transition"
      :value="item.value"
    >
      <component :is="component" :domain="item.value" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
import { DOMAIN_TABS } from "@/constants";

defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const tab = ref();
</script>

<style scoped lang="css"></style>
