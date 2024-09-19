/* game states */

import { Guid } from "guid-typescript";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { BlackPieceTag, WhitePieceTag } from "../../../shared/utils/objects/constantLists";
import { NMatrix, SMatrix } from "../../../shared/utils/types/commonTypes";

// available coordinate numbers
type CoordinateNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coordinate = [CoordinateNumber, CoordinateNumber];

// states of the game
export type GameStates = {
  // game id
  gameId: Guid;
  // game data obtained from get game call
  gameData: GetGameDto | null;
  // current player data
  playerData: GetPlayerDto | null;
  // board in matrix form
  matrix: SMatrix;
  // current state of board represented by controlled areas by each side
  controlledAreas: {
    white: NMatrix;
    black: NMatrix;
  };
  // areas that are influencing king checks
  checkAreas: {
    white: NMatrix;
    black: NMatrix;
  };
};

// states off current user selection
export type SelectionStates = {
  // if user is dragging a piece
  isDragging: boolean;
  // selected piece
  piece: WhitePieceTag | BlackPieceTag | "";
  // clicked target by user
  target: HTMLElement | null;
  // selected coordinates
  coordinates: Coordinate;
  // coordinates where promotion should happen
  promotionCoor: Coordinate;
  // areas where selected piece can move to
  availableFields: NMatrix;
};

export const gameInitialStates: GameStates = {
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

type GameAction =
  | { type: "SET_GAME_ID"; payload: Guid }
  | { type: "SET_GAME_DATA"; payload: GetGameDto }
  | { type: "SET_PLAYER_DATA"; payload: GetPlayerDto }
  | { type: "SET_MATRIX"; payload: SMatrix }
  | { type: "SET_CONTROLLED_AREAS"; payload: { white: NMatrix; black: NMatrix } }
  | { type: "SET_CHECK_AREAS"; payload: { white: NMatrix; black: NMatrix } };

// states for game
export const gameStatesReducer = (state: GameStates, action: GameAction): GameStates => {
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
  coordinates: [0, 0],
  promotionCoor: [0, 0],
  availableFields: [],
};

type SelectionAction =
  | { type: "SET_PIECE"; payload: WhitePieceTag | BlackPieceTag | "" }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_TARGET"; payload: HTMLElement | null }
  | { type: "SET_COORDINATES"; payload: Coordinate }
  | { type: "SET_PROMOTION_COOR"; payload: Coordinate }
  | { type: "SET_AVAILABLE_FIELDS"; payload: NMatrix };

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
