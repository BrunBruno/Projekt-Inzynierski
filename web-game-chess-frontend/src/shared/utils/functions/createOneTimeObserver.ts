/* observer global functions */

// function for creating one time use observer
export const createOneTimeObserver = (
  // action to exectue on intersection
  action: (entry: IntersectionObserverEntry) => void,
  // observer options
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          // execute action
          action(entry);

          // unobserve element
          observer.unobserve(entry.target);
        }
      });
    },
    // pass observer options
    options
  );

  return observer;
};
