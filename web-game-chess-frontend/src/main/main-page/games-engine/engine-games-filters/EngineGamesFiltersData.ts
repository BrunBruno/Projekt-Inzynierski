export type ResultListFilterOption = {
  value: boolean | null;
  label: string;
};

export const resultListFilterOptions: ResultListFilterOption[] = [
  { value: true, label: "Wins" },
  { value: false, label: "Loses" },
  { value: null, label: "Draws" },
];
