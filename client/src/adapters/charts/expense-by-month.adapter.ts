import { ChartData } from "chart.js";
import { TableTransactionItemData } from "@/types";

export default (
  items: TableTransactionItemData[],
  periodicity: string
): ChartData => {
  const chartData: ChartData = {
    labels: [],
    datasets: [],
  };
  items.forEach((item) => {
    if (!chartData.labels?.includes(item.group.name)) {
      chartData.labels?.push(item.group.name);
      // chartData.datasets.
    }
    chartData;
  });

  return chartData;
};
