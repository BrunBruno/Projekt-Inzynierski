import { Guid } from "guid-typescript";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { GetWebGameDto, GetWebGamePlayerDto } from "../types/gameDtos";
import { SMatrix } from "../types/commonTypes";
import { GetEngineGameDto } from "../types/engineDtos";
import { PlayerDto } from "../types/abstractDtosAndModels";

// available coordinate numbers
export type CoorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// coordinate type
export type Coordinate = [CoorNumber, CoorNumber] | null;
// any option in matrix
export type PieceOption = WhitePieceTag | BlackPieceTag | "";

export enum TypeOfGame {
  web,
  engine,
}

// states of the game
export type WebGameStates = {
  // game id
  gameId: Guid;
  // game data obtained from get game call
  gameData: GetWebGameDto | null;
  // current player data
  playerData: GetWebGamePlayerDto | null;
  // board in matrix form
  matrix: SMatrix;
  // current state of board represented by controlled areas by each side
  controlledAreas: {
    white: Coordinate[];
    black: Coordinate[];
  };
  // areas that are influencing king checks
  checkAreas: {
    white: Coordinate[];
    black: Coordinate[];
  };
};

// states of the game
export type EngineGameStates = {
  // game id
  gameId: Guid;
  // game data obtained from get game call
  gameData: GetEngineGameDto | null;
  // current player data
  playerData: PlayerDto | null;
  // board in matrix form
  matrix: SMatrix;
  // current state of board represented by controlled areas by each side
  controlledAreas: {
    white: Coordinate[];
    black: Coordinate[];
  };
  // areas that are influencing king checks
  checkAreas: {
    white: Coordinate[];
    black: Coordinate[];
  };
};

// states off current user selection
export type SelectionStates = {
  // if user is dragging a piece
  isDragging: boolean;
  // selected piece
  piece: PieceOption;
  // clicked target by user
  target: HTMLElement | null;
  // selected coordinates
  coordinates: Coordinate;
  // coordinates where promotion should happen
  promotionCoor: Coordinate;
  // areas where selected piece can move to
  availableFields: Coordinate[];
};
