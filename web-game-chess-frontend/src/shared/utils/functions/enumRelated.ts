/* enumns related global functions */

import { EnumType } from "../types/commonTypes";

// gets enu type by its value
export const getEnumTypeByNumber = (enumElements: EnumType, typeN: number): string => {
  const type = Object.entries(enumElements).find(([, value]) => value === typeN)?.[0];

  if (type) return type.toLocaleLowerCase();
  return "";
};
