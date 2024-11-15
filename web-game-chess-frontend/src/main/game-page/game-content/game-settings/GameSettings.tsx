import { useEffect, useState } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { specialPiecesSvgs } from "../../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
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
import { GetEngineGameDto } from "../../../../shared/utils/types/engineDtos";
import { GetWebGameDto } from "../../../../shared/utils/types/gameDtos";

type GameSettingsProps = {
  // game data
  gameData: GetEngineGameDto | GetWebGameDto;
};

function GameSettings({ gameData }: GameSettingsProps) {
  ///

  const { showPopup } = usePopup();

  const [appearance, setAppearance] = useState<UpdateUserSettingsModel | null>(null);

  useEffect(() => {
    const prevAppearance: UpdateUserSettingsModel = {
      appearanceOfBoard: gameData.gameSettings.appearanceOfBoard,
      appearanceOfGamePage: gameData.gameSettings.appearanceOfGamePage,
      appearanceOfPieces: gameData.gameSettings.appearanceOfPieces,
    };
    setAppearance(prevAppearance);
  }, [gameData]);

  const updateUserSettings = async ({
    appearanceOfBoard,
    appearanceOfGamePage,
    appearanceOfPieces,
  }: Partial<UpdateUserSettingsModel>): Promise<void> => {
    const model: Partial<UpdateUserSettingsModel> = {
      ...(appearanceOfBoard !== undefined && { appearanceOfBoard }),
      ...(appearanceOfGamePage !== undefined && { appearanceOfGamePage }),
      ...(appearanceOfPieces !== undefined && { appearanceOfPieces }),
    };

    try {
      await axios.put(userController.updateUserSettings(), model, getAuthorization());

      setAppearance((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          ...(appearanceOfBoard !== undefined && { appearanceOfBoard }),
          ...(appearanceOfGamePage !== undefined && { appearanceOfGamePage }),
          ...(appearanceOfPieces !== undefined && { appearanceOfPieces }),
        };
      });
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  if (!appearance) return <></>;

  return (
    <div className={classes.settings}>
      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Pieces</p>

        <div className={classes["row-options"]}>
          <div
            className={classes["option"]}
            onClick={() => {
              updateUserSettings({ appearanceOfPieces: AppearanceOfPieces.Standard });
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
              updateUserSettings({ appearanceOfPieces: AppearanceOfPieces.Simple });
            }}
          >
            <div className={classes["pieces-look"]}>
              <IconCreator icons={specialPiecesSvgs} iconName={"p"} color={"white"} iconClass={classes["piece-icon"]} />
            </div>

            <div className={classes["option-text"]}>
              <p
                className={`
                  ${classes["ind"]} 
                  ${appearance.appearanceOfPieces === AppearanceOfPieces.Simple ? classes.active : ""}
                `}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Board</p>

        <div className={classes["row-options"]}>
          <div
            className={classes["option"]}
            onClick={() => {
              updateUserSettings({ appearanceOfBoard: AppearanceOfBoard.Default });
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
              updateUserSettings({ appearanceOfBoard: AppearanceOfBoard.Rounded });
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
              updateUserSettings({ appearanceOfBoard: AppearanceOfBoard.Wooden });
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
              updateUserSettings({ appearanceOfBoard: AppearanceOfBoard.Grey });
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
              updateUserSettings({ appearanceOfGamePage: AppearanceOfGamePage.Simple });
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
              updateUserSettings({ appearanceOfGamePage: AppearanceOfGamePage.Full });
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
