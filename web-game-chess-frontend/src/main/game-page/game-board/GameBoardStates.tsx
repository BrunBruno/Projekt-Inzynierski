import { Guid } from "guid-typescript";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { GameStates, SelectionStates } from "../../../shared/utils/types/gameStates";

export const gameInitialStates: GameStates = {
  gameId: Guid.createEmpty(),
  gameData: null,
  playerData: null,
  matrix: [],
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
  | { type: "SET_MATRIX"; payload: string[][] }
  | {
      type: "SET_CONTROLLED_AREAS";
      payload: { white: number[][]; black: number[][] };
    }
  | {
      type: "SET_CHECK_AREAS";
      payload: { white: number[][]; black: number[][] };
    };

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
  coordinates: [],
  promotionCoor: [],
  availableFelds: [],
};

type SelectionAction =
  | { type: "SET_PIECE"; payload: string }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_TARGET"; payload: HTMLElement | null }
  | { type: "SET_COORDINATES"; payload: number[] }
  | { type: "SET_PROMOTION_COOR"; payload: number[] }
  | { type: "SET_AVAILABLE_FIELDS"; payload: number[][] };

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
      return { ...state, availableFelds: action.payload };
    default:
      return state;
  }
};
