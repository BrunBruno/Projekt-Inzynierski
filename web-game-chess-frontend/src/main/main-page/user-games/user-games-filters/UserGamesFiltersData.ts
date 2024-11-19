// filters options

import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";

export type TimingTypeListFilterOption = {
  value: TimingType;
  label: TimingTypeName;
};

export const timingTypeListFilterOptions: TimingTypeListFilterOption[] = [
  { value: TimingType.bullet, label: "bullet" },
  { value: TimingType.blitz, label: "blitz" },
  { value: TimingType.rapid, label: "rapid" },
  { value: TimingType.classic, label: "classic" },
  { value: TimingType.daily, label: "daily" },
];

export type ResultListFilterOption = {
  value: boolean | null;
  label: string;
};

export const resultListFilterOptions: ResultListFilterOption[] = [
  { value: true, label: "Wins" },
  { value: false, label: "Loses" },
  { value: null, label: "Draws" },
];
