let timeOut: number;
export const delayAction = (func: () => void, delay: number) => {
  clearTimeout(timeOut);
  timeOut = setTimeout(func, delay);
};
