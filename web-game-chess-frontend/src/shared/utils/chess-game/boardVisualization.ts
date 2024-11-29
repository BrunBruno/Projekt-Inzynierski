import { posToIndex } from "./general";
import { RefObject } from "react";
import { Coordinate } from "./gameSates";
import { AppearanceOfBoard, AppearanceOfPieces, PieceColor } from "../objects/entitiesEnums";
import { PlayerDto } from "../types/abstractDtosAndModels";
import { ElementClass, IconMap } from "../types/commonTypes";
import { defaultPiecesImages } from "../../svgs/iconsMap/DefaultPieceImageSvgs";
import { piecesIconsVariantC } from "../../svgs/iconsMap/PiecesIconsVariantC";
import { PieceTag } from "../objects/constantLists";
import { piecesIconsVariantA } from "../../svgs/iconsMap/PiecesIconsVariantA";
import { piecesIconsVariantB } from "../../svgs/iconsMap/PiecesIconsVariantB";

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
  if (selectedTarget && boardRef && coorFrom && coorTo) {
    const tileWidth = boardRef.getBoundingClientRect().width / 8;
    const tileHeight = boardRef.getBoundingClientRect().height / 8;
    const xChange = coorFrom[0] - coorTo[0];
    const yChange = coorFrom[1] - coorTo[1];

    let translateX = tileWidth * xChange;
    let translateY = tileHeight * yChange;

    if (playerData.color === PieceColor.white) translateX = translateX * -1;
    if (playerData.color === PieceColor.black) translateY = translateY * -1;

    if (selectedTarget.style.transform === "none")
      selectedTarget.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
  }
};

export const playMoveSound = (captureHappened: boolean, checkHappened: boolean): void => {
  const sound: HTMLAudioElement = checkHappened
    ? new Audio("/sounds/check.mp3")
    : captureHappened
    ? new Audio("/sounds/capture.mp3")
    : new Audio("/sounds/move.mp3");

  // if (selectedTarget.style.transform === "none") {
  sound.play().catch((error) => {
    console.error(error);
  });
  // }
};

// for provided correct class by user settings
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

// for provided correct icons by user settings
export const changePiecesByUserSettings = (appearance: AppearanceOfPieces): IconMap<PieceTag> => {
  switch (appearance) {
    case AppearanceOfPieces.Standard:
      return defaultPiecesImages;

    case AppearanceOfPieces.VariantA:
      return piecesIconsVariantA;

    case AppearanceOfPieces.VariantB:
      return piecesIconsVariantB;

    case AppearanceOfPieces.VariantC:
      return piecesIconsVariantC;

    default:
      return defaultPiecesImages;
  }
};
