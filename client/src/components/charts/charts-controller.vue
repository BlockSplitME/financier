<template>
  <div v-for="chart in charts.visibleCharts.value">
    <component
      :is="chart.chartComponent"
      :data="chart.data"
      :options="chart.options"
    ></component>
    <component :is="chart.settingComponent"></component>
  </div>
</template>

<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useCharts } from "@/composables";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const charts = useCharts();
</script>

<style scoped lang="css"></style>
