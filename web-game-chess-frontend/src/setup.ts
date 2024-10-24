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

// mock the game hub
vi.mock("@microsoft/signalr", () => {
  const connectionMock = {
    on: vi.fn(),
    off: vi.fn(),
    start: vi.fn().mockResolvedValueOnce(undefined),
    stop: vi.fn(),
    invoke: vi.fn().mockResolvedValue(undefined),
    state: "Connected",
  };

  return {
    HubConnectionBuilder: vi.fn().mockImplementation(() => {
      return {
        withUrl: vi.fn().mockReturnThis(),
        configureLogging: vi.fn().mockReturnThis(),
        build: vi.fn().mockReturnValue(connectionMock),
      };
    }),
    HttpTransportType: {
      None: 0,
      WebSockets: 1,
      ServerSentEvents: 2,
      LongPolling: 4,
    },
    LogLevel: {
      Trace: 0,
      Debug: 1,
      Information: 2,
      Warning: 3,
      Error: 4,
      Critical: 5,
      None: 6,
    },
    HubConnectionState: {
      Disconnected: "Disconnected",
      Connecting: "Connecting",
      Connected: "Connected",
      Disconnecting: "Disconnecting",
      Reconnecting: "Reconnecting",
    },
  };
});
