import "@testing-library/jest-dom/vitest";

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}

    // Mock properties that IntersectionObserver expects
    root: Element | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];

    // Mock the methods used in IntersectionObserver
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
});
