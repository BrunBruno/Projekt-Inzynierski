/* shared const list */

// list of side colors
export const sideColors = ["White", "Black"] as const;
export type SideColor = Lowercase<typeof sideColors[number]>;

// list and type for piece tags
export const pieceTags = ["p", "n", "b", "r", "q", "k"] as const;
export type PieceTag = typeof pieceTags[number];
export type WhitePieceTag = Uppercase<PieceTag>;
export type BlackPieceTag = Lowercase<PieceTag>;

// list for pieces name
export const pieceNames = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King"] as const;
export type PieceName = Lowercase<typeof pieceNames[number]>;

// list for timing types
export const timingTypeNames = ["Bullet", "Blitz", "Rapid", "Classic", "Daily"] as const;
export type TimingTypeName = Lowercase<typeof timingTypeNames[number]>;

// list for end game possible results
export const gameResults = ["Win", "Draw", "Lose"] as const;
export type GameResultName = Lowercase<typeof gameResults[number]>;

// list for popup icons
export const popupIconTypes = ["success", "info", "warning", "error"] as const;
export type PopupIconName = Lowercase<typeof popupIconTypes[number]>;
