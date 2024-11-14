import { posToIndex } from "./general";
import { RefObject } from "react";
import { Coordinate } from "./gameSates";
import { AppearanceOfBoard, AppearanceOfPieces, PieceColor } from "../objects/entitiesEnums";
import { PlayerDto } from "../types/abstractDtosAndModels";
import { ElementClass, IconMap } from "../types/commonTypes";
import { defaultPiecesImages } from "../../svgs/iconsMap/DefaultPieceImageSvgs";
import { specialPiecesSvgs } from "../../svgs/iconsMap/SpecialPiecesSvgs";
import { PieceTag } from "../objects/constantLists";

// to highlighting selected file
// for tip displaying
export const onHighlightFile = (
  ref: RefObject<HTMLDivElement>,
  coordinates: Coordinate,
  highlightClass: string,
  filedClass: string
) => {
  if (ref.current) {
    const index = posToIndex(coordinates);
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
  playerData: PlayerDto,
  coorFrom: Coordinate,
  coorTo: Coordinate
) => {
  if (boardRef && coorFrom && coorTo) {
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

//
export const changeBoardByUserSettings = (appearance: AppearanceOfBoard, classes: CSSModuleClasses): ElementClass => {
  switch (appearance) {
    case AppearanceOfBoard.Default:
      return "";

    case AppearanceOfBoard.Rounded:
      return classes["rounded"];

    case AppearanceOfBoard.Grey:
      return classes["grey"];

    case AppearanceOfBoard.Wooden:
      return classes["wooden"];

    default:
      return "";
  }
};

//
export const changePiecesByUserSettings = (appearance: AppearanceOfPieces): IconMap<PieceTag> => {
  switch (appearance) {
    case AppearanceOfPieces.Standard:
      return defaultPiecesImages;

    case AppearanceOfPieces.Simple:
      return specialPiecesSvgs;
  }
};
