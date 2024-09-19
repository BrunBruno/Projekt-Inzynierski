import { PieceColor } from "../objects/entitiesEnums";
import { PosToIndex } from "./gameRelated";
import { GetPlayerDto } from "../types/gameDtos";
import { RefObject } from "react";

// to highlighting selected file
// for tip displaying
export const onHighlightFile = (
  ref: RefObject<HTMLDivElement>,
  coordinates: number[],
  highlightClass: string,
  filedClass: string
) => {
  if (ref.current) {
    const index = PosToIndex(coordinates);
    const element = ref.current.querySelectorAll(`.${filedClass}`)[index];

    if (element.classList.contains(highlightClass)) {
      element.classList.remove(highlightClass);
    } else {
      element.classList.add(highlightClass);
    }
  }
};

// to clear all highlights
export const onClearHighlights = (highlightClass: string): void => {
  const highlightedElements = document.querySelectorAll(`.${highlightClass}`);
  highlightedElements.forEach((element) => {
    (element as HTMLElement).classList.remove(highlightClass);
  });
};

// to show piece movement animation
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

    if (playerData.color === PieceColor.white) translateX = translateX * -1;
    if (playerData.color === PieceColor.black) translateY = translateY * -1;

    if (selectedTarget) {
      selectedTarget.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }
};
