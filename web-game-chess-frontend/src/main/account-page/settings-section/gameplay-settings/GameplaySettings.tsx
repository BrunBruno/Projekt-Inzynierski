import { useEffect, useState } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { specialPiecesSvgs } from "../../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
} from "../../../../shared/utils/objects/entitiesEnums";
import { GetFullUserDto } from "../../../../shared/utils/types/userDtos";
import classes from "./GameplaySettings.module.scss";
import { UpdateUserSettingsModel } from "../../../../shared/utils/types/userModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import axios from "axios";
import { engineGameController, getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import { UpdateEngineSettingsModel } from "../../../../shared/utils/types/engineGameModels";

type GameplaySettingsProps = {
  // user data for settings updates
  user: GetFullUserDto | null;
};

function GameplaySettings({ user }: GameplaySettingsProps) {
  ///

  const { showPopup } = usePopup();

  // current game appearance
  const [appearance, setAppearance] = useState<UpdateUserSettingsModel | null>(null);
  // engine games related settings
  const [areCheatsAllowed, setAreCheatsAllowed] = useState<boolean>(false);

  // set current appearance
  useEffect(() => {
    if (!user) return;

    const prevAppearance: UpdateUserSettingsModel = {
      appearanceOfBoard: user.settings.appearanceOfBoard,
      appearanceOfGamePage: user.settings.appearanceOfGamePage,
      appearanceOfPieces: user.settings.appearanceOfPieces,
    };

    setAppearance(prevAppearance);
    setAreCheatsAllowed(user.settings.allowCheats);
  }, [user]);

  // to update user global settings
  const updateUserSettings = async ({
    appearanceOfBoard,
    appearanceOfGamePage,
    appearanceOfPieces,
  }: Partial<UpdateUserSettingsModel>): Promise<void> => {
    const model: UpdateUserSettingsModel = {
      appearanceOfBoard: appearanceOfBoard !== undefined ? appearanceOfBoard : null,
      appearanceOfGamePage: appearanceOfGamePage !== undefined ? appearanceOfGamePage : null,
      appearanceOfPieces: appearanceOfPieces !== undefined ? appearanceOfPieces : null,
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

  //
  const changeEngineSettings = async (allow: boolean): Promise<void> => {
    const model: UpdateEngineSettingsModel = {
      allowCheats: allow,
    };

    try {
      await axios.put(engineGameController.updateEngineSettings(), model, getAuthorization());

      setAreCheatsAllowed(allow);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  if (!appearance) return <></>;

  return (
    <div className={classes.settings}>
      <div className={classes.settings__row}>
        <h3 className={classes["row-title"]}>
          <span>Customize Chess Pieces</span>
        </h3>
        <p className={classes["row-text"]}>Adjust the style of your chess pieces to suit your preferences.</p>

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
              <span>Default</span>
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
              <span>Icons</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <h3 className={classes["row-title"]}>
          <span>Personalize Your Chess Board</span>
        </h3>
        <p className={classes["row-text"]}>
          Transform your chessboard to match your aesthetic and enhance your experience.
        </p>

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
              <span>Connected</span>
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
              <span>Rounded</span>
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
              <span>Wooden</span>
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
              <span>Colorless</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <h3 className={classes["row-title"]}>
          <span>Overall Page Style</span>
        </h3>
        <p className={classes["row-text"]}>Modify the layout and style of the game page for the look you prefer.</p>

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
              <span>Simple view</span>
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
              <span>Full view</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <h3 className={classes["row-title"]}>
          <span>Restore Default Appearance Settings</span>
        </h3>

        <p className={classes["row-text"]}>
          Revert all appearance and layout settings to their original default values.
        </p>

        <div className={classes["row-options"]}>
          <button className={classes["clear-button"]}>
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Cheats During Games With Engine</p>

        <form className={classes["settings-form"]}>
          <div className={classes["form-row"]}>
            <label className={classes["visibility-label"]}>
              <input
                name="visibility"
                type="radio"
                className={classes["radio-input"]}
                checked={!areCheatsAllowed}
                onChange={() => {
                  changeEngineSettings(false);
                }}
              />
              <span className={classes["check-mark"]}></span>
              <span>Disable Cheats</span>
            </label>

            <p className={classes["text"]}>
              Restrict in-game cheats. Players will be unable to undo moves or modify the chess engine during the match,
              ensuring a fair and uninterrupted experience.
            </p>
          </div>

          <div className={classes["form-row"]}>
            <label className={classes["visibility-label"]}>
              <input
                name="visibility"
                type="radio"
                className={classes["radio-input"]}
                checked={areCheatsAllowed}
                onChange={() => {
                  changeEngineSettings(true);
                }}
              />
              <span className={classes["check-mark"]}></span>
              <span>Allow Cheats</span>
            </label>

            <p className={classes["text"]}>
              Enable in-game cheats, allowing players to undo moves and change the chess engine settings during
              gameplay.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameplaySettings;
