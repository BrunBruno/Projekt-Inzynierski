import { EnumType } from "../types/commonTypes";

export const getTimingTypeByNumber = (
  enumElements: EnumType,
  typeN: number
): string => {
  const type = Object.entries(enumElements).find(
    ([, value]) => value === typeN
  )?.[0];

  if (type) return type.toLocaleLowerCase();
  return "";
};
