import classes from "./GameplaySettings.module.scss";

type GameplaySettingsProps = {};

function GameplaySettings({}: GameplaySettingsProps) {
  ///
  return (
    <div className={classes.settings}>
      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Pieces</p>

        <div className={classes["row-options"]}></div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Board</p>

        <div className={classes["row-options"]}>
          <div className={classes["option"]}>
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-normal"]} />
              ))}
            </div>

            <span>Connected</span>
          </div>

          <div className={classes["option"]}>
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-rounded"]} />
              ))}
            </div>

            <span>Rounded</span>
          </div>

          <div className={classes["option"]}>
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-wooden"]} />
              ))}
            </div>

            <span>Wooden</span>
          </div>

          <div className={classes["option"]}>
            <div className={classes["board-look"]}>
              {Array.from({ length: 9 }).map((_, i: number) => (
                <p key={`tile${i}`} className={classes["tile-bnw"]} />
              ))}
            </div>

            <span>No color</span>
          </div>
        </div>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Page appearance</p>

        <div className={classes["row-options"]}>
          <div className={classes["option"]}>
            <div className={classes["screen"]}>
              <div className={classes["lsb-h"]}></div>
              <div className={classes["board"]}>
                {Array.from({ length: 9 }).map((_, i: number) => (
                  <p key={`s-tile-${i}`} />
                ))}
              </div>
              <div className={classes["rsb-h"]}></div>
            </div>

            <span>Simple view</span>
          </div>

          <div className={classes["option"]}>
            <div className={classes["screen"]}>
              <div className={classes["lsb-o"]}></div>
              <div className={classes["board"]}>
                {Array.from({ length: 9 }).map((_, i: number) => (
                  <p key={`s-tile-${i}`} />
                ))}
              </div>
              <div className={classes["rsb-o"]}></div>
            </div>

            <span>Full view</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameplaySettings;
