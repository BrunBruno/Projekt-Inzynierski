/* event related general function*/

// delays and cancels action for given time
let timeOut: NodeJS.Timeout;
export const delayAction = (func: () => void, delay: number): void => {
  clearTimeout(timeOut);
  timeOut = setTimeout(func, delay);
};

export const delayAsyncAction = (func: () => Promise<void>, delay: number): void => {
  clearTimeout(timeOut);
  timeOut = setTimeout(func, delay);
};

// to delay task
export const taskDelay = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
