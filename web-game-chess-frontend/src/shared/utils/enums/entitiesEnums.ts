// from backend enums

type EnumType = {
  [key: string]: number;
};

// from back end data configuration enum
export const dataConfigurations: EnumType = {
  userPassword: 1,
  userName: 2,
};

// from back-end color enum
export const pieceColor: EnumType = {
  white: 0,
  black: 1,
};

// from back-end game timining type enum
export const timingTypes: EnumType = {
  bullet: 0,
  blitz: 1,
  rapid: 2,
  classic: 3,
  daily: 4,
};

// from back-end reasons why game has eneded
export const endGameTypes: EnumType = {
  checkMate: 1,
  outOfTime: 2,
  resignation: 3,
  staleMate: 4,
  threefold: 5,
  agreement: 6,
  fiftyMovesRule: 7,
  insufficientMaterial: 8,
};

export const friendshipStatus: EnumType = {
  all: -1,
  pending: 0,
  accepted: 1,
  rejected: 2,
};
