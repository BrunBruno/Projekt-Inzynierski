import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";

export type QuickTimeControl = {
  header: TimingTypeName;
  tag: string;
  value: [number, number];
};

// game timings data
export const quickTimeControls: QuickTimeControl[] = [
  {
    header: "bullet",
    tag: "1min",
    value: [1, 0],
  },
  {
    header: "blitz",
    tag: "3min",
    value: [3, 0],
  },
  {
    header: "rapid",
    tag: "10min",
    value: [10, 0],
  },
] as const;
