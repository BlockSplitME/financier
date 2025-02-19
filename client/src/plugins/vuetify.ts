/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// Adapters
import DateFnsAdapter from "@date-io/date-fns";
import { enUS, ru } from "date-fns/locale";
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  date: {
    adapter: DateFnsAdapter,
    locale: {
      en: enUS,
      ru,
    },
  },
});
