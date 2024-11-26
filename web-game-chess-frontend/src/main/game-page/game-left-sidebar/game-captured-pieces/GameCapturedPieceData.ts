import { BlackPieceTag, WhitePieceTag } from "../../../../shared/utils/objects/constantLists";

export type WhiteCapturedPiecesRecord = Record<WhitePieceTag, number>;
export type BlackCapturedPiecesRecord = Record<BlackPieceTag, number>;
