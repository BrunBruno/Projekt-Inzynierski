import { PieceColor } from "../objects/entitiesEnums";
import { pieceTagMap } from "../objects/piecesNameMaps";
import { movementMap, rankMap } from "../objects/piecesMovementMap";
import { GameStates, SelectionStates } from "../types/gameStates";
import { areCoorEqual, checkIfOwnPiece } from "./gameRelated";

class FindMoves {
  // pins directions
  private readonly directions = {
    ver: "ver",
    hor: "hor",
    btd: "btd",
    tbd: "tbd",
  };

  // vectors for pins
  private readonly directionMap: { [key: string]: number[][] } = {
    hor: [
      [1, 0],
      [-1, 0],
    ],
    ver: [
      [0, 1],
      [0, -1],
    ],
    btd: [
      [1, 1],
      [-1, -1],
    ],
    tbd: [
      [1, -1],
      [-1, 1],
    ],
  };

  // current game states
  private gameState: GameStates | null = null;
  // user selection states
  private selectionState: SelectionStates | null = null;
  // selected piece
  private selectedPiece: string | null = null;
  // selected coor
  private selectedCoor: number[] | null = null;

  // generate areas when pieces can move to
  public find = (
    gameState: GameStates,
    selectionState: SelectionStates,
    selectedPiece: string | null = null,
    selectedCoor: number[] | null = null
  ): number[][] => {
    let foundTips: number[][] = [];

    this.gameState = gameState;
    this.selectionState = selectionState;

    // choose selected piece or checked piece
    this.selectedPiece = selectedPiece ? selectedPiece : this.selectionState.piece;
    this.selectedCoor = selectedCoor ? selectedCoor : this.selectionState.coordinates;

    if (this.selectedPiece === "" && this.selectedCoor.length === 0) return [];
    if (!this.gameState.playerData) return [];

    // add selected coordinates
    let availableMoves: number[][] = [this.selectedCoor];

    const color: number | null = this.gameState.playerData.color;
    const [xCoor, yCoor] = availableMoves[0];

    // check for pins
    const [isPinned, direction] = this.checkPin([xCoor, yCoor]);
    const directionVector: number[][] | null = isPinned ? this.directionMap[direction] : null;

    switch (this.selectedPiece) {
      case pieceTagMap.white.pawn:
      case pieceTagMap.black.pawn:
        // no horizontal moves for pinned pawns
        if (direction !== this.directions.hor) foundTips = this.checkPawnMove([xCoor, yCoor], directionVector);
        break;

      case pieceTagMap.white.knight:
      case pieceTagMap.black.knight:
        // no moves for pinned knights
        if (!isPinned) foundTips = this.checkKnightMoves([xCoor, yCoor]);
        break;

      case pieceTagMap.white.bishop:
      case pieceTagMap.black.bishop:
        // no straights moves for pinned bishops
        if (direction !== this.directions.ver && direction !== this.directions.hor)
          foundTips = this.checkPiecesMoves([xCoor, yCoor], movementMap.bishopMoves, directionVector);
        break;

      case pieceTagMap.white.rook:
      case pieceTagMap.black.rook:
        // no diagonal moves for pinned rooks
        if (direction !== this.directions.tbd && direction !== this.directions.btd)
          foundTips = this.checkPiecesMoves([xCoor, yCoor], movementMap.rookMoves, directionVector);
        break;

      case pieceTagMap.white.queen:
      case pieceTagMap.black.queen:
        foundTips = this.checkPiecesMoves([xCoor, yCoor], movementMap.queenMoves, directionVector);
        break;

      case pieceTagMap.white.king:
        foundTips = this.checkKingMoves([xCoor, yCoor], this.gameState.controlledAreas.black, pieceTagMap.white.king);
        break;

      case pieceTagMap.black.king:
        foundTips = this.checkKingMoves([xCoor, yCoor], this.gameState.controlledAreas.white, pieceTagMap.black.king);
        break;

      default:
        break;
    }

    // if check exist then limit pieces moves to stop check
    if (this.selectedPiece !== pieceTagMap.white.king && this.selectedPiece !== pieceTagMap.black.king) {
      // if check exist for white
      if (color === PieceColor.white && this.gameState.checkAreas.black.length > 0) {
        // filter for those that eliminates check

        foundTips = foundTips.filter((tip) =>
          this.gameState!.checkAreas.black.some((check) => areCoorEqual(check, tip))
        );
      }

      // if check exist for black
      if (color === PieceColor.black && this.gameState.checkAreas.white.length > 0) {
        // filter for those that eliminates check

        foundTips = foundTips.filter((tip) =>
          this.gameState!.checkAreas.white.some((check) => areCoorEqual(check, tip))
        );
      }
    }

    availableMoves.push(...foundTips);

    return availableMoves;
  };

  // isValid | isEmpty
  private isValidField = ([x, y]: [number, number]): boolean[] => {
    if (!this.gameState || !this.selectedPiece || !this.gameState.playerData) return [false, false];

    let isValid: boolean = false;
    let isEmpty: boolean = false;

    if (
      x >= rankMap.white.backRank &&
      x <= rankMap.black.backRank &&
      y >= rankMap.white.backRank &&
      y <= rankMap.black.backRank
    ) {
      const piece = this.gameState.matrix[y - 1][x - 1];
      isEmpty = piece === "";
      if (isEmpty) return [true, true];

      const isOwnPiece = checkIfOwnPiece(piece, this.gameState.playerData);

      isValid = !isOwnPiece;
    }

    return [isValid, isEmpty];
  };

  // check for all available pawn moves
  private checkPawnMove = ([xCoor, yCoor]: [number, number], directions: number[][] | null): number[][] => {
    const availableMoves: number[][] = [];

    const pawnDirectionMap = {
      straight: 0,
      diagL: 1,
      diagR: -1,
    };
    const dir: number | null = directions ? directions[0][0] * directions[0][1] : null;

    const enPassantCoor: number[] | null = this.gameState?.gameData?.enPassant
      ? this.gameState.gameData.enPassant.split(",").map(Number)
      : null;

    // check for white pawns move

    switch (this.gameState?.playerData?.color) {
      case PieceColor.white: {
        let firstIsValid: boolean = false;
        let x: number;
        let y: number;

        x = xCoor;
        y = yCoor + 1;

        // check pawn forward move
        if (this.isValidPawnMove([x, y], dir, pawnDirectionMap.straight)) {
          firstIsValid = true;
          availableMoves.push([x, y]);
        }

        x = xCoor + 1;
        y = yCoor + 1;

        // check pawn capture
        if (this.isValidPawnCapture([x, y], dir, pawnDirectionMap.diagL, enPassantCoor)) {
          availableMoves.push([x, y]);
        }

        x = xCoor - 1;
        y = yCoor + 1;

        // check pawn capture
        if (this.isValidPawnCapture([x, y], dir, pawnDirectionMap.diagR, enPassantCoor)) {
          availableMoves.push([x, y]);
        }

        // check forward move from starting position
        if (firstIsValid && yCoor === rankMap.white.pawnStartRank) {
          x = xCoor;
          y = yCoor + 2;

          if (this.isValidPawnMove([x, y], dir, pawnDirectionMap.straight)) {
            availableMoves.push([x, y]);
          }
        }

        break;
      }

      case PieceColor.black: {
        let firstIsValid: boolean = false;
        let x: number;
        let y: number;

        x = xCoor;
        y = yCoor - 1;

        // check pawn forward move
        if (this.isValidPawnMove([x, y], dir, pawnDirectionMap.straight)) {
          firstIsValid = true;
          availableMoves.push([x, y]);
        }

        x = xCoor + 1;
        y = yCoor - 1;

        // check pawn capture
        if (this.isValidPawnCapture([x, y], dir, pawnDirectionMap.diagR, enPassantCoor)) {
          availableMoves.push([x, y]);
        }

        x = xCoor - 1;
        y = yCoor - 1;

        // check pawn capture
        if (this.isValidPawnCapture([x, y], dir, pawnDirectionMap.diagL, enPassantCoor)) {
          availableMoves.push([x, y]);
        }

        // check forward move from starting position
        if (firstIsValid && yCoor === rankMap.black.pawnStartRank) {
          x = xCoor;
          y = yCoor - 2;

          if (this.isValidPawnMove([x, y], dir, pawnDirectionMap.straight)) {
            availableMoves.push([x, y]);
          }
        }

        break;
      }

      default:
        break;
    }

    return availableMoves;
  };

  private isValidPawnMove([x, y]: [number, number], dir: number | null, dirCheck: number): boolean {
    const [isValid, isEmpty] = this.isValidField([x, y]);
    return isValid && isEmpty && (dir === null || dir === dirCheck);
  }

  private isValidPawnCapture(
    [x, y]: [number, number],
    dir: number | null,
    dirCheck: number,
    enPassantCoor: number[] | null
  ): boolean {
    const [isValid, isEmpty] = this.isValidField([x, y]);
    return (
      isValid &&
      (!isEmpty || (enPassantCoor !== null && areCoorEqual(enPassantCoor, [x, y]))) &&
      (dir === null || dir === dirCheck)
    );
  }

  // check for all available knight moves
  private checkKnightMoves = ([xCoor, yCoor]: [number, number]): number[][] => {
    const availableMoves: number[][] = [];

    for (const [dx, dy] of movementMap.knightMoves) {
      const x = xCoor + dx;
      const y = yCoor + dy;

      const isValid = this.isValidField([x, y])[0];
      if (isValid) availableMoves.push([x, y]);
    }

    return availableMoves;
  };

  // check for all available rest of pieces moves
  private checkPiecesMoves = (
    [xCoor, yCoor]: [number, number],
    pieceMoves: number[][],
    directions: number[][] | null
  ): number[][] => {
    const availableMoves: number[][] = [];

    // set available moves to all or to limited when pinned
    const moves: number[][] = directions ? directions : pieceMoves;

    let [isValid, isEmpty]: boolean[] = [];

    for (const [dx, dy] of moves) {
      let x = xCoor + dx;
      let y = yCoor + dy;

      [isValid, isEmpty] = this.isValidField([x, y]);
      // check for all in line
      while (isValid) {
        availableMoves.push([x, y]);

        if (!isEmpty) break;

        x += dx;
        y += dy;

        [isValid, isEmpty] = this.isValidField([x, y]);
      }
    }

    return availableMoves;
  };

  // check for all available king moves
  private checkKingMoves = ([xCoor, yCoor]: [number, number], areas: number[][], piece: string): number[][] => {
    const availableMoves: number[][] = [];

    // check for all moves
    for (const [dx, dy] of movementMap.kingMoves) {
      const x = xCoor + dx;
      const y = yCoor + dy;

      const isValid = this.isValidField([x, y])[0];

      const isInArea = areas.some((coord) => areCoorEqual([x, y], coord));

      if (isValid && !isInArea) {
        availableMoves.push([x, y]);
      }
    }

    // check castling and king not in check
    if (!areas.some((coord) => areCoorEqual([xCoor, yCoor], coord)) && this.gameState && this.gameState.gameData) {
      // short castle possible and king not in check
      if (
        // short castling still enable for any of kings
        (this.gameState.gameData.canWhiteKingCastle &&
          this.gameState.gameData.canWhiteShortRookCastle &&
          piece === pieceTagMap.white.king) ||
        (this.gameState.gameData.canBlackKingCastle &&
          this.gameState.gameData.canBlackShortRookCastle &&
          piece === pieceTagMap.black.king)
      ) {
        // if areas where king is passing are empty and not in enemies controll
        if (
          // first field empty and not in check
          this.gameState.matrix[yCoor - 1][xCoor - 1 + 1] === "" &&
          !areas.some((coord) => areCoorEqual([xCoor + 1, yCoor], coord)) &&
          // second field empty and not in check
          this.gameState.matrix[yCoor - 1][xCoor - 1 + 2] === "" &&
          !areas.some((coord) => areCoorEqual([xCoor + 2, yCoor], coord))
        ) {
          availableMoves.push([xCoor + 2, yCoor]);
        }
      }

      // long castle possible and king not in check
      if (
        // long castling still enable for any of kings
        (this.gameState.gameData.canWhiteKingCastle &&
          this.gameState.gameData.canWhiteLongRookCastle &&
          piece === pieceTagMap.white.king) ||
        (this.gameState.gameData.canBlackKingCastle &&
          this.gameState.gameData.canBlackLongRookCastle &&
          piece === pieceTagMap.black.king)
      ) {
        // if areas where king is passing are empty and not in enemies control
        if (
          // first field empty and not in check
          this.gameState.matrix[yCoor - 1][xCoor - 1 - 1] === "" &&
          !areas.some((coord) => areCoorEqual([xCoor - 1, yCoor], coord)) &&
          // second field empty and not in check
          this.gameState.matrix[yCoor - 1][xCoor - 1 - 2] === "" &&
          !areas.some((coord) => areCoorEqual([xCoor - 2, yCoor], coord)) &&
          // third field empty
          this.gameState.matrix[yCoor - 1][xCoor - 1 - 3] === ""
        ) {
          availableMoves.push([xCoor - 2, yCoor]);
        }
      }
    }

    return availableMoves;
  };

  // to return direction value
  private checkDirection = (x: number, y: number): string => {
    if (x === 0) return this.directions.ver;
    if (y === 0) return this.directions.hor;
    if (x * y < 0) return this.directions.tbd;
    if (x * y > 0) return this.directions.btd;
    return "";
  };

  // check if piece is pinned (return isPinned, direction of pin)
  private checkPin = ([xCoor, yCoor]: [number, number]): [boolean, string] => {
    if (!this.gameState || !this.gameState.playerData) return [false, ""];

    // no pines for king
    if (this.selectedPiece === pieceTagMap.white.king || this.selectedPiece === pieceTagMap.black.king) {
      return [false, ""];
    }

    // in form [piece, direction]
    const foundPieces: string[][] = [];

    // check for all possible pins
    for (const [dx, dy] of movementMap.queenMoves) {
      let x = xCoor + dx;
      let y = yCoor + dy;

      while (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
        const piece = this.gameState!.matrix[y - 1][x - 1];
        if (piece !== "") {
          const dir = this.checkDirection(dx, dy);
          foundPieces.push([piece, dir]);
          break;
        }

        x += dx;
        y += dy;
      }
    }

    let isPinning: boolean = false;
    let direction: string = "";

    switch (this.gameState.playerData.color) {
      case PieceColor.white: {
        // check if king is in line
        const whiteKing = foundPieces.find((piece) => piece[0] === pieceTagMap.white.king);

        if (whiteKing) {
          // find piece aligned with king
          const whiteKingDir = whiteKing[1];
          const pinningPiece = foundPieces.find(
            (piece) => piece[1] === whiteKingDir && piece[0] !== pieceTagMap.white.king
          );

          if (pinningPiece) {
            // check for diagonal pins
            if (
              (whiteKingDir === this.directions.btd || whiteKingDir === this.directions.tbd) &&
              (pinningPiece[0] === pieceTagMap.black.bishop || pinningPiece[0] === pieceTagMap.black.queen)
            ) {
              direction = whiteKingDir;
              isPinning = true;
            }
            // check for file pins
            if (
              (whiteKingDir === this.directions.hor || whiteKingDir === this.directions.ver) &&
              (pinningPiece[0] === pieceTagMap.black.rook || pinningPiece[0] === pieceTagMap.black.queen)
            ) {
              direction = whiteKingDir;
              isPinning = true;
            }
          }
        }

        break;
      }

      case PieceColor.black: {
        // check if king is in line
        const blackKing = foundPieces.find((piece) => piece[0] === pieceTagMap.black.king);

        if (blackKing) {
          // find piece aligned with king
          const blackKingDir = blackKing[1];
          const pinningPiece = foundPieces.find(
            (piece) => piece[1] === blackKingDir && piece[0] !== pieceTagMap.black.king
          );

          if (pinningPiece) {
            // check for diagonal pins
            if (
              (blackKingDir === this.directions.btd || blackKingDir === this.directions.tbd) &&
              (pinningPiece[0] === pieceTagMap.white.bishop || pinningPiece[0] === pieceTagMap.white.queen)
            ) {
              direction = blackKingDir;
              isPinning = true;
            }
            // check for file pins
            if (
              (blackKingDir === this.directions.hor || blackKingDir === this.directions.ver) &&
              (pinningPiece[0] === pieceTagMap.white.rook || pinningPiece[0] === pieceTagMap.white.queen)
            ) {
              direction = blackKingDir;
              isPinning = true;
            }
          }
        }

        break;
      }

      default:
        break;
    }

    return [isPinning, direction];
  };
}

export default new FindMoves();
