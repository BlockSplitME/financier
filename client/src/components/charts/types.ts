import { Component } from "vue";
import { ChartData, ChartOptions } from "chart.js";

export type ChartCard = {
  type: ChartType;
  label: string;
  chartComponent: Component;
  settingComponent: Component;
  data: ChartData | null;
  isVisible: boolean;
  options?: ChartOptions;
  adapter?: () => ChartData;
};

export enum ChartType {
  ExpenseChartByMonth,
}
