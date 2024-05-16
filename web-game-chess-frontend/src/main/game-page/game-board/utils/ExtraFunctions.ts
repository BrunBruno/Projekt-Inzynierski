import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import {
  PieceTagMap,
  pieceTagMap,
} from "../../../../shared/utils/enums/piecesMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";

// check if player can move
export const checkIfPlayerTurn = (
  turn: number,
  color: number | null
): boolean => {
  if (
    (turn % 2 === 0 && color === pieceColor.white) ||
    (turn % 2 === 1 && color === pieceColor.black)
  ) {
    return true;
  }
  return false;
};

// check if coordinates are the same
export const checkCoordinatesEquality = (
  coor: number[],
  selectedCoor: number[]
): boolean => {
  if (coor[0] === selectedCoor[0] && coor[1] === selectedCoor[1]) {
    return true;
  }

  return false;
};

// to check if clicked piece is own or opponents piece
export const checkIfOwnPiece = (
  char: string,
  playerData: GetPlayerDto
): boolean => {
  for (const color in pieceTagMap) {
    const pieces = pieceTagMap[color as keyof PieceTagMap];

    if (Object.values(pieces).includes(char)) {
      if (playerData.color === pieceColor[color]) {
        return true;
      }
    }
  }

  return false;
};

export const intToChar = (i: number): string => {
  return String.fromCharCode(65 + (i - 1));
};

export const onHighlightFile = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  filedClass: string,
  highlightClass: string
) => {
  event.preventDefault();

  const addHighlight = (element: HTMLElement) => {
    if (element.classList.contains(highlightClass)) {
      element.classList.remove(highlightClass);
    } else {
      element.classList.add(highlightClass);
    }
  };

  const element = event.target as HTMLElement;
  if (!element.classList.contains(filedClass)) {
    const parent = element.parentElement as HTMLElement;
    if (parent.classList.contains(filedClass)) {
      addHighlight(parent);
    } else {
      const secParent = parent.parentElement as HTMLElement;
      if (secParent.classList.contains(filedClass)) {
        addHighlight(secParent);
      }
    }
  } else {
    addHighlight(element);
  }
};

export const onClearHighlights = (highlightClass: string): void => {
  const highlightedElements = document.querySelectorAll(`.${highlightClass}`);
  highlightedElements.forEach((element) => {
    (element as HTMLElement).classList.remove(highlightClass);
  });
};

export const performMoveAnimation = (
  boardRef: HTMLDivElement | null,
  selectedTarget: HTMLElement | null,
  playerData: GetPlayerDto,
  coorFrom: number[],
  coorTo: number[]
) => {
  if (boardRef) {
    const tileWidth = boardRef.getBoundingClientRect().width / 8;
    const tileHeight = boardRef.getBoundingClientRect().height / 8;
    const xChange = coorFrom[0] - coorTo[0];
    const yChange = coorFrom[1] - coorTo[1];

    let translateX = tileWidth * xChange;
    let translateY = tileHeight * yChange;
    if (playerData.color === pieceColor.white) translateX = translateX * -1;
    if (playerData.color === pieceColor.black) translateY = translateY * -1;

    if (selectedTarget) {
      selectedTarget.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }
};

export const fromPositionToListIndex = (coor: number[]): number => {
  const x = coor[0] - 1;
  const y = Math.abs(coor[1] - 1 - 7);
  return y * 8 + x;
};
