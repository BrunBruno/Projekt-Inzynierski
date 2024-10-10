import "@testing-library/jest-dom/vitest";

beforeAll(() => {
  // mock the observers
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}

    root: Element | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
});
