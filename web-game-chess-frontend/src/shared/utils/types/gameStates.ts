/* types for representing essential states that are used during game */

import { Guid } from "guid-typescript";
import { GetGameDto, GetPlayerDto } from "./gameDtos";

// states of the game
export type GameStates = {
  // game id
  gameId: Guid;
  // game data obtained from get game call
  gameData: GetGameDto | null;
  // current player data
  playerData: GetPlayerDto | null;
  // board in matrix form
  matrix: string[][];
  // current state of board represented by controlled areas by each side
  controlledAreas: {
    white: number[][];
    black: number[][];
  };
  // areas that are influencing king checks
  checkAreas: {
    white: number[][];
    black: number[][];
  };
};

// states off current user selection
export type SelectionStates = {
  // if user is dragging a piece
  isDragging: boolean;
  // selected piece
  piece: string;
  // clicked target by user
  target: HTMLElement | null;
  // selected coordinates
  coordinates: number[];
  // coordinates where promotion should happen
  promotionCoor: number[];
  // areas where selected piece can move to
  availableFields: number[][];
};
