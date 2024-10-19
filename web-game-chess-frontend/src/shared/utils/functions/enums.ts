/* enums related global functions */

import { TimingTypeName } from "../objects/constantLists";

// gets enu type by its value
export const getEnumKeyByEnumValue = <T extends object>(enumObj: T, enumValue: T[keyof T]): string => {
  const key = Object.keys(enumObj).find((key) => enumObj[key as keyof T] === enumValue);

  return key ? key : "";
};

// get enum value by key
export const getEnumValueByKey = <T>(enumObj: T, key: string): T[keyof T] => {
  return enumObj[key as keyof typeof enumObj];
};

// for showing correct timing type name
export const displayTimingName = (timing: TimingTypeName): string => {
  return timing.charAt(0).toUpperCase() + timing.slice(1);
};
