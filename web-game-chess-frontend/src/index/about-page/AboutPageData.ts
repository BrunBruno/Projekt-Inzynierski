import {
  ContentElements,
  introductionElements,
  objectivesElements,
  privacyElements,
  termsElements,
} from "./content-sections/ContentSectionData";

// section names
export type ContentNames = "Introduction" | "Objectives" | "Terms" | "Privacy";

// section data
export type ContentType = {
  // title of selected content
  title: ContentNames;
  // list on sub sections of selected content
  elements: ContentElements[];
};

// section element
export type ContentOptions = {
  [key in Lowercase<ContentNames>]: ContentType;
};

// page interface options
export const contentOptions: ContentOptions = {
  introduction: { title: "Introduction", elements: introductionElements },
  objectives: { title: "Objectives", elements: objectivesElements },
  terms: { title: "Terms", elements: termsElements },
  privacy: { title: "Privacy", elements: privacyElements },
};
