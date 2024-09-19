// game timing options

type TimeControl = {
  header: string;
  tags: string[];
  values: [number, number][];
};

// game timings data
export const defaultTimeControls: TimeControl[] = [
  {
    header: "Bullet",
    tags: ["1min", "1m|1s", "2min"],
    values: [
      [1, 0],
      [1, 1],
      [2, 0],
    ],
  },
  {
    header: "Blitz",
    tags: ["3min", "3m|5s", "5min"],
    values: [
      [3, 0],
      [3, 5],
      [5, 0],
    ],
  },
  {
    header: "Rapid",
    tags: ["10min", "10m|10s", "30min"],
    values: [
      [10, 0],
      [10, 10],
      [30, 0],
    ],
  },
  {
    header: "Classic",
    tags: ["1hour", "2hours", "3hours"],
    values: [
      [60, 0],
      [120, 0],
      [180, 0],
    ],
  },
  {
    header: "Daily",
    tags: ["1day", "2days", "7days"],
    values: [
      [1440, 0],
      [2880, 0],
      [10080, 0],
    ],
  },
] as const;
