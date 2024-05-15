// enums for changing page content based on user selection

type EnumType = {
  [key: string]: number;
};

// to disiniguish different type of content it main page
export const gameSearchInterface: EnumType = {
  vsPlayer: 0,
  vsComputer: 1,
  vsFriend: 2,
  searching: 3,
};

// to distinguish registration modals
export const registrationInterface: EnumType = {
  signIn: 1,
  signUp: 2,
  verify: 3,
};
