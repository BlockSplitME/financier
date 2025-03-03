import { Radar } from "vue-chartjs";
import IntervalSelection from "@/components/charts/settings/interval-selection.vue";
import { api } from "@/api";
import {
  Domain,
  GetTransactionParams,
  TableTransactionItemData,
  ChartCard,
  ChartType,
} from "@/types";
import { toast } from "vuetify-sonner";
import { AxiosError } from "axios";
import { expenseByMonthAdapter } from "@/adapters";

export default () => {
  const charts = ref<ChartCard[]>([
    {
      type: ChartType.ExpenseChartByMonth,
      label: "Диаграмма расходов по месяцам",
      chartComponent: Radar,
      settingComponent: IntervalSelection,
      data: null,
      isVisible: true,
      adapter: (payload: TableTransactionItemData[]) =>
        expenseByMonthAdapter(payload),
    },
  ]);

  const visibleCharts = computed(() =>
    charts.value.filter((chart) => chart.isVisible)
  );

  const loadDataForChart = async (charts?: ChartCard[] = charts.value) => {
    charts.forEach((chart) => {
      switch (chart.type) {
        case ChartType.ExpenseChartByMonth:
          const result = await fetchTransactions(Domain.EXPENSES);
          chart.data = result ? chart.adapter() : null;
          break;
        default:
          chart.data = null;
      }
    });
  };

  const fetchTransactions = async (
    domain: Domain,
    params: GetTransactionParams
  ): Promise<TableTransactionItemData[] | null> => {
    try {
      const { items } = await api.getTransactionsByDomain(domain, params);
      return items;
    } catch (error) {
      toast.error(`Ошибка получения данных для диаграммы.`, {
        description: (error as AxiosError).message,
      });
    }
    return null;
  };

  return {
    visibleCharts,
    loadDataForChart,
  };
};
