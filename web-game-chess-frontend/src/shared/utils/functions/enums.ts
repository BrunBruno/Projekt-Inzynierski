/* enums related global functions */

// gets enu type by its value
export const getEnumKeyByEnumValue = <T extends object>(enumObject: T, enumValue: T[keyof T]): string => {
  const key = Object.keys(enumObject).find((key) => enumObject[key as keyof T] === enumValue);

  return key ? key : "";
};

// get enum value by key
export const getEnumValueByKey = <T>(enumObject: T, key: string): T[keyof T] => {
  return enumObject[key as keyof typeof enumObject];
};

// for showing correct timing type name
export const displayFromLowercase = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
