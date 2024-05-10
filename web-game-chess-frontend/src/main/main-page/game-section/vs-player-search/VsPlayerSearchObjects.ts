type TimeControl = {
  header: string;
  tags: string[];
  values: number[][];
};

export const defaultTimeControls: TimeControl[] = [
  {
    header: 'Bullet',
    tags: ['1+0', '1+1', '2+0'],
    values: [
      [1, 0],
      [1, 1],
      [2, 0],
    ],
  },
  {
    header: 'Blitz',
    tags: ['3+0', '3+5', '5+0'],
    values: [
      [3, 0],
      [3, 5],
      [5, 0],
    ],
  },
  {
    header: 'Rapid',
    tags: ['10+0', '10+10', '30+0'],
    values: [
      [10, 0],
      [10, 10],
      [30, 0],
    ],
  },
  {
    header: 'Classical',
    tags: ['1h', '2h', '3h'],
    values: [
      [60, 0],
      [120, 0],
      [180, 0],
    ],
  },
  {
    header: 'Daily',
    tags: ['1d', '2d', '7d'],
    values: [
      [1440, 0],
      [2880, 0],
      [10080, 0],
    ],
  },
] as const;
