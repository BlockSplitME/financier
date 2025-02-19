// stylelint.config.mjs
import orderPlugin from "stylelint-order";

export default {
  extends: [
    "stylelint-config-html",
    "stylelint-config-standard",
    "stylelint-config-recommended-vue",
    "stylelint-config-recommended",
    "stylelint-prettier/recommended",
  ],
  plugins: [orderPlugin], // Плагин для порядка свойств
  rules: {
    // Правила Stylelint
    "at-rule-no-unknown": null, // Разрешить неизвестные @-правила (например, для SCSS)
    "at-rule-no-deprecated": null, // Разрешить неизвестные @-правила (например, для SCSS)
    "prettier/prettier": [
      true,
      {
        // Игнорировать пустые <style> блоки
        ignore: ["empty"],
      },
    ],
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "alpha-value-notation": "number",
    "color-function-notation": "modern",
    "custom-property-empty-line-before": "never",
    "no-empty-source": null,
  },
};
