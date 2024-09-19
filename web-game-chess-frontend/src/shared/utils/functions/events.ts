/* event related general function*/

// delays and cancels action for given time
let timeOut: number;
export const delayAction = (func: () => void, delay: number): void => {
  clearTimeout(timeOut);
  timeOut = setTimeout(func, delay);
};
