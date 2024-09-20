import { Guid } from "guid-typescript";
import { BlackPieceTag, WhitePieceTag } from "../../../shared/utils/objects/constantLists";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { SMatrix } from "../../../shared/utils/types/commonTypes";

// available coordinate numbers
export type CoorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
//
export type Coordinate = [CoorNumber, CoorNumber] | null;
//
export type PieceOption = WhitePieceTag | BlackPieceTag | "";

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
