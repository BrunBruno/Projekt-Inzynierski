/* from backend enums representations */

// from back end data configuration enum
export enum DataConfigurations {
  userPassword = 1,
  userName = 2,
}

// from back-end color enum
export enum PieceColor {
  white = 0,
  black = 1,
}

// from back-end game timing type enum
export enum TimingTypes {
  bullet = 0,
  blitz = 1,
  rapid = 2,
  classic = 3,
  daily = 4,
}

// from back-end reasons why game has ended
export enum EndGameTypes {
  checkMate = 1,
  outOfTime = 2,
  resignation = 3,
  staleMate = 4,
  threefold = 5,
  agreement = 6,
  fiftyMovesRule = 7,
  insufficientMaterial = 8,
}

// from back-end statuses of friendship requests
export enum FriendshipStatus {
  all = -1,
  pending = 0,
  accepted = 1,
  rejected = 2,
}
