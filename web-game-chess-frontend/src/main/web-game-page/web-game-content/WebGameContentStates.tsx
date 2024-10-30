/* game states */

import { Guid } from "guid-typescript";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { SMatrix } from "../../../shared/utils/types/commonTypes";
import { Coordinate, PieceOption, SelectionStates, WebGameStates } from "../../../shared/utils/chess-game/types";

export const gameInitialStates: WebGameStates = {
  gameId: Guid.createEmpty(),
  gameData: null,
  playerData: null,
  matrix: [[], [], [], [], [], [], [], []],
  controlledAreas: {
    white: [],
    black: [],
  },
  checkAreas: {
    white: [],
    black: [],
  },
};

export type GameAction =
  | { type: "SET_GAME_ID"; payload: Guid }
  | { type: "SET_GAME_DATA"; payload: GetGameDto }
  | { type: "SET_PLAYER_DATA"; payload: GetPlayerDto }
  | { type: "SET_MATRIX"; payload: SMatrix }
  | { type: "SET_CONTROLLED_AREAS"; payload: { white: Coordinate[]; black: Coordinate[] } }
  | { type: "SET_CHECK_AREAS"; payload: { white: Coordinate[]; black: Coordinate[] } };

// states for game
export const gameStatesReducer = (state: WebGameStates, action: GameAction): WebGameStates => {
  switch (action.type) {
    case "SET_GAME_ID":
      return { ...state, gameId: action.payload };
    case "SET_GAME_DATA":
      return { ...state, gameData: action.payload };
    case "SET_PLAYER_DATA":
      return { ...state, playerData: action.payload };
    case "SET_MATRIX":
      return { ...state, matrix: action.payload };
    case "SET_CONTROLLED_AREAS":
      return { ...state, controlledAreas: action.payload };
    case "SET_CHECK_AREAS":
      return { ...state, checkAreas: action.payload };
    default:
      return state;
  }
};

export const selectionInitialStates: SelectionStates = {
  isDragging: false,
  piece: "",
  target: null,
  coordinates: null,
  promotionCoor: null,
  availableFields: [],
};

export type SelectionAction =
  | { type: "SET_PIECE"; payload: PieceOption }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_TARGET"; payload: HTMLElement | null }
  | { type: "SET_COORDINATES"; payload: Coordinate }
  | { type: "SET_PROMOTION_COOR"; payload: Coordinate }
  | { type: "SET_AVAILABLE_FIELDS"; payload: Coordinate[] };

// stats for user selections
export const selectionStatesReducer = (state: SelectionStates, action: SelectionAction): SelectionStates => {
  switch (action.type) {
    case "SET_PIECE":
      return { ...state, piece: action.payload };
    case "SET_IS_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_TARGET":
      return { ...state, target: action.payload };
    case "SET_COORDINATES":
      return { ...state, coordinates: action.payload };
    case "SET_PROMOTION_COOR":
      return { ...state, promotionCoor: action.payload };
    case "SET_AVAILABLE_FIELDS":
      return { ...state, availableFields: action.payload };
    default:
      return state;
  }
};
