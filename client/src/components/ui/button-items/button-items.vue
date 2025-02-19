<template>
  <div class="d-flex ga-4">
    <v-btn
      v-for="(option, index) in options"
      :text="option.label"
      :color="option.color"
      :loading="option.isLoading"
      @click="option.action()"
    />
    <!--    @click="$emit('action', index)"-->
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { ButtonsOptions } from "@/types";

defineProps({
  options: {
    type: Array as PropType<ButtonsOptions[]>,
  },
});
defineEmits<{
  action: [number: number];
}>();
</script>

<style scoped lang="css"></style>
