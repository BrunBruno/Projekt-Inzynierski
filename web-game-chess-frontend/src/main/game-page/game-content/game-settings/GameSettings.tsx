import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { piecesIconsVariantC } from "../../../../shared/svgs/iconsMap/PiecesIconsVariantC";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
} from "../../../../shared/utils/objects/entitiesEnums";
import classes from "./GameSettings.module.scss";
import { UpdateUserSettingsModel } from "../../../../shared/utils/types/userModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import axios from "axios";
import { getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import { GetEngineGameDto, GetEngineGameWinnerDto } from "../../../../shared/utils/types/engineGameDtos";
import { GetWebGameDto, GetWebGameWinnerDto } from "../../../../shared/utils/types/webGameDtos";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { gameSettingsIcons } from "./GameSettingsIcons";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { piecesIconsVariantB } from "../../../../shared/svgs/iconsMap/PiecesIconsVariantB";
import { piecesIconsVariantA } from "../../../../shared/svgs/iconsMap/PiecesIconsVariantA";

type GameSettingsProps = {
  // game data
  gameData: GetEngineGameDto | GetWebGameDto;
  winnerData: GetWebGameWinnerDto | GetEngineGameWinnerDto | null;
  // for closing window
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function GameSettings({ gameData, winnerData, setDisplayedWindow }: GameSettingsProps) {
  ///

  const { showPopup } = usePopup();

  // current appearance and for update
  const [appearance, setAppearance] = useState<UpdateUserSettingsModel | null>(null);

  // to set values of current settings
  useEffect(() => {
    const prevAppearance: UpdateUserSettingsModel = {
      appearanceOfBoard: gameData.gameSettings.appearanceOfBoard,
      appearanceOfGamePage: gameData.gameSettings.appearanceOfGamePage,
      appearanceOfPieces: gameData.gameSettings.appearanceOfPieces,
    };
    setAppearance(prevAppearance);
  }, [gameData]);

  const updateUserSettings = async (): Promise<void> => {
    if (!appearance) return;

    const model: UpdateUserSettingsModel = {
      ...appearance,
    };

    try {
      await axios.put(userController.updateUserSettings(), model, getAuthorization());
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const changeBoardAppearance = (newLook: AppearanceOfBoard): void => {
    if (!appearance) return;
    setAppearance({
      ...appearance,
      appearanceOfBoard: newLook,
    });
  };

  const changePiecesAppearance = (newLook: AppearanceOfPieces): void => {
    if (!appearance) return;
    setAppearance({
      ...appearance,
      appearanceOfPieces: newLook,
    });
  };

  const changeWindowAppearance = (newLook: AppearanceOfGamePage): void => {
    if (!appearance) return;
    setAppearance({
      ...appearance,
      appearanceOfGamePage: newLook,
    });
  };

  const onApplySettings = async (): Promise<void> => {
    await updateUserSettings();

    window.location.reload();
  };

  const onCancelSettings = (): void => {
    if (winnerData) setDisplayedWindow(GameWindowInterface.winner);
    else setDisplayedWindow(GameWindowInterface.none);
  };

  if (!appearance) return <></>;

  return (
    <div className={classes.settings}>
      <div className={classes.settings__header}>
        <h2 className={classes["title"]}>
          <IconCreator
            icons={gameSettingsIcons}
            iconName={"settings"}
            iconClass={classes["header-icon"]}
            color={greyColor.c0}
          />
          <span>Settings</span>
        </h2>

        <div className={classes["actions"]}>
          <button
            className={classes["set-button"]}
            onClick={() => {
              onApplySettings();
            }}
          >
            <IconCreator
              icons={gameResultIcons}
              iconName={"win"}
              iconClass={classes["action-icon"]}
              color={greyColor.c5}
            />
            <span>Apply</span>
          </button>
          <button
            className={classes["set-button"]}
            onClick={() => {
              onCancelSettings();
            }}
          >
            <IconCreator
              icons={gameResultIcons}
              iconName={"lose"}
              iconClass={classes["action-icon"]}
              color={greyColor.c5}
            />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Pieces appearance</p>

        <div className={classes["row-options"]}>
          <div
            className={classes["option"]}
            onClick={() => {
              changePiecesAppearance(AppearanceOfPieces.Standard);
            }}
          >
            <div className={classes["pieces-look"]}>
              <IconCreator
                icons={defaultPiecesImages}
                iconName={"p"}
                color={"white"}
                iconClass={classes["piece-icon"]}
              />
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfPieces === AppearanceOfPieces.Standard ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changePiecesAppearance(AppearanceOfPieces.VariantA);
            }}
          >
            <div className={classes["pieces-look"]}>
              <IconCreator
                icons={piecesIconsVariantA}
                iconName={"p"}
                color={"white"}
                iconClass={classes["piece-icon"]}
              />
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfPieces === AppearanceOfPieces.VariantA ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changePiecesAppearance(AppearanceOfPieces.VariantB);
            }}
          >
            <div className={classes["pieces-look"]}>
              <IconCreator
                icons={piecesIconsVariantB}
                iconName={"p"}
                color={"white"}
                iconClass={classes["piece-icon"]}
              />
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfPieces === AppearanceOfPieces.VariantB ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changePiecesAppearance(AppearanceOfPieces.VariantC);
            }}
          >
            <div className={classes["pieces-look"]}>
              <IconCreator
                icons={piecesIconsVariantC}
                iconName={"p"}
                color={"white"}
                iconClass={classes["piece-icon"]}
              />
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfPieces === AppearanceOfPieces.VariantC ? classes.active : ""}
                `}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Board appearance</p>

        <div className={classes["row-options"]}>
          <div
            className={classes["option"]}
            onClick={() => {
              changeBoardAppearance(AppearanceOfBoard.Default);
            }}
          >
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-normal"]} />
              ))}
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfBoard === AppearanceOfBoard.Default ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changeBoardAppearance(AppearanceOfBoard.Rounded);
            }}
          >
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-rounded"]} />
              ))}
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfBoard === AppearanceOfBoard.Rounded ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changeBoardAppearance(AppearanceOfBoard.Wooden);
            }}
          >
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-wooden"]} />
              ))}
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfBoard === AppearanceOfBoard.Wooden ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changeBoardAppearance(AppearanceOfBoard.Grey);
            }}
          >
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-bnw"]} />
              ))}
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfBoard === AppearanceOfBoard.Grey ? classes.active : ""}
                `}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Page appearance</p>

        <div className={classes["row-options"]}>
          <div
            className={classes["option"]}
            onClick={() => {
              changeWindowAppearance(AppearanceOfGamePage.Simple);
            }}
          >
            <div className={classes["screen"]}>
              <div className={classes["lsb-h"]}></div>
              <div className={classes["board"]}>
                {Array.from({ length: 9 }).map((_, i: number) => (
                  <p key={`s-tile-${i}`} />
                ))}
              </div>
              <div className={classes["rsb-h"]}></div>
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfGamePage === AppearanceOfGamePage.Simple ? classes.active : ""}
                `}
              />
            </div>
          </div>

          <div
            className={classes["option"]}
            onClick={() => {
              changeWindowAppearance(AppearanceOfGamePage.Full);
            }}
          >
            <div className={classes["screen"]}>
              <div className={classes["lsb-o"]}></div>
              <div className={classes["board"]}>
                {Array.from({ length: 9 }).map((_, i: number) => (
                  <p key={`s-tile-${i}`} />
                ))}
              </div>
              <div className={classes["rsb-o"]}></div>
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfGamePage === AppearanceOfGamePage.Full ? classes.active : ""}
                `}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSettings;
