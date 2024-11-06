<template>
  <v-col>
    <v-text-field
      v-model.number="sum"
      hide-spin-buttons
      label="Сумма"
      type="number"
      variant="outlined"
      @input="validateNumber"
    />
  </v-col>
  <v-col align-self="center">
    <v-slider
      v-model="sum"
      :color="sliderColor"
      :max="5000"
      :min="0"
      :step="1"
      track-color="grey"
    >
      <template #prepend>
        <v-btn
          :color="sliderColor"
          icon="mdi-minus"
          size="small"
          variant="text"
          @click="sliderDecrement"
        />
      </template>

      <template #append>
        <v-btn
          :color="sliderColor"
          icon="mdi-plus"
          size="small"
          variant="text"
          @click="sliderIncrement"
        />
      </template>
    </v-slider>
  </v-col>
</template>

<script setup lang="ts">

  import { computed } from 'vue'

  const sum = defineModel<number>('modelValue', {
    type: Number,
    required: true,
  })

  const sliderColor = computed(() => {
    if (sum.value < 300) return '#636363'
    if (sum.value < 600) return '#635252'
    if (sum.value < 900) return '#b38484'
    if (sum.value < 1500) return '#e69191'
    if (sum.value < 3000) return '#fa7070'
    return '#fa3434'
  })

  const validateNumber = () => {
    sum.value = Number(sum.value)
    if (sum.value < 0) sum.value = 0
  }
  const sliderDecrement = () => {
    if (sum.value) sum.value -= 1
  }
  const sliderIncrement = () => {
    sum.value = Number(sum.value) + 1
  }
</script>

<style scoped lang="css">
</style>
