// eslint.config.mjs
import vuePlugin from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    // Настройки для всех файлов
    files: ["**/*.{js,ts,vue}"],
    ignores: ["node_modules/", "dist/", "public/"], // Игнорируемые файлы и папки
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
      globals: {
        // Глобальные переменные
        process: true,
        console: true,
      },
    },
    plugins: {
      vue: vuePlugin, // Плагин для Vue
      "@typescript-eslint": tsPlugin, // Плагин для TypeScript
      prettier: prettierPlugin, // Плагин для Prettier
    },
    rules: {
      // Правила ESLint
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

      // Правила TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",

      // Правила Vue
      "vue/multi-word-component-names": "off", // Разрешить однословные имена компонентов
      "vue/require-default-prop": "off", // Не требовать значения по умолчанию для props

      // Интеграция Prettier
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", // Автоматически определять конец строки
        },
      ],
    },
  },
  // Отключение правил ESLint, которые конфликтуют с Prettier
  prettierConfig,
];
