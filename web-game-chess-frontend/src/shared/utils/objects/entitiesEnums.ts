/* from backend enums representations */

// from back end data configuration enum
export enum DataConfiguration {
  userPassword = 1,
  userName = 2,
}

// from back-end color enum
export enum PieceColor {
  white = 1,
  black = 2,
}

// from back-end game timing type enum
export enum TimingType {
  bullet = 1,
  blitz = 2,
  rapid = 3,
  classic = 4,
  daily = 5,
}

// from back-end reasons why game has ended
export enum GameEndReason {
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
  all = 0,
  pending = 1,
  accepted = 2,
  rejected = 3,
}

// message type enum
export enum MessageType {
  normal = 0,
  drawAction = 1,
  bot = 2,
}

//
export enum AppearanceOfBoard {
  Default,
  Rounded,
  Wooden,
  Grey,
}

//
export enum AppearanceOfGamePage {
  Simple,
  Full,
}

//
export enum AppearanceOfPieces {
  Standard,
  VariantA,
  VariantB,
  VariantC,
}
