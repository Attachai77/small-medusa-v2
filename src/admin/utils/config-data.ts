import type { ConfigData } from "../../types/config-data";

export const findConfigDataByPath = (items: ConfigData[] | { path: string, value: string }[], _path: string) => {
  const value = items.find((item) => item.path === _path);

  return value?.value ?? "";
};
