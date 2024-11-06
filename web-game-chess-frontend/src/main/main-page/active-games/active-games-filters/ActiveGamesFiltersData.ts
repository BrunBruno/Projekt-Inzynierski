// filters options

import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";

export type TimingTypeListFilterOption = {
  value: number;
  label: TimingTypeName;
};

export const timingTypeListFilterOptions: TimingTypeListFilterOption[] = [
  { value: 0, label: "bullet" },
  { value: 1, label: "blitz" },
  { value: 2, label: "rapid" },
  { value: 3, label: "classic" },
  { value: 4, label: "daily" },
];
