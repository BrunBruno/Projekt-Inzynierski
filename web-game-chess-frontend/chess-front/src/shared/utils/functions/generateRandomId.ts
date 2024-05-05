// generate random id with given base
export const generateRandomId = (base: number): string => {
  return Math.random().toString(base);
};
