// types for representing essentail states that are used during game

import { GetGameDto, GetPlayerDto } from "./gameDtos";

export type GameStates = {
  gameId: string;
  gameData: GetGameDto | null;
  playerData: GetPlayerDto | null;
  matrix: string[][];
  controlledAreas: {
    white: number[][];
    black: number[][];
  };
  checkAreas: {
    white: number[][];
    black: number[][];
  };
};

export type SelectionStates = {
  isDragging: boolean;
  piece: string;
  target: HTMLElement | null;
  coordinates: number[];
  promotionCoor: number[];
  availableFelds: number[][];
};
