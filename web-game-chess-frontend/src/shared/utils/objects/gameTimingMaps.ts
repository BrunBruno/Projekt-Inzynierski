import { TimingTypeName } from "./constantLists";

export type TimeControl = {
  header: TimingTypeName;
  tags: string[];
  values: [number, number][];
};

// game timings data
export const defaultTimeControls: TimeControl[] = [
  {
    header: "bullet",
    tags: ["1min", "1m|1s", "2min"],
    values: [
      [1, 0],
      [1, 1],
      [2, 0],
    ],
  },
  {
    header: "blitz",
    tags: ["3min", "3m|5s", "5min"],
    values: [
      [3, 0],
      [3, 5],
      [5, 0],
    ],
  },
  {
    header: "rapid",
    tags: ["10min", "10m|10s", "30min"],
    values: [
      [10, 0],
      [10, 10],
      [30, 0],
    ],
  },
  {
    header: "classic",
    tags: ["1hour", "2hours", "3hours"],
    values: [
      [60, 0],
      [120, 0],
      [180, 0],
    ],
  },
  {
    header: "daily",
    tags: ["1day", "2days", "7days"],
    values: [
      [1440, 0],
      [2880, 0],
      [10080, 0],
    ],
  },
] as const;
