import { isProxy, toRaw } from "vue";

function isObject(value: unknown): boolean {
  return value !== null && typeof value === "object";
}

function getRawData<T>(data: T): T {
  return isProxy(data) ? toRaw(data) : data;
}

/**
 * Глубокое клонирование прокси-объекта, который может содержать другие прокси
 * @param data
 */
export default function cloneProxy<T>(data: T): T {
  const rawData = getRawData<T>(data);

  for (const key in rawData) {
    const value = rawData[key];

    if (!Array.isArray(value) && !isObject(value)) {
      continue;
    }

    rawData[key] = cloneProxy<typeof value>(value);
  }

  return structuredClone(rawData);
}
