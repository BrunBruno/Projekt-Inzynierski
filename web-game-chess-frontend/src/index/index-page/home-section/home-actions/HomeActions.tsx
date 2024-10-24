import { useNavigate } from "react-router-dom";
import classes from "./HomeActions.module.scss";
import { RegistrationInterface, StateOptions } from "../../../../shared/utils/objects/interfacesEnums";

const partOfPawn = 6;

type HomeActionsProps = {};

function HomeActions({}: HomeActionsProps) {
  ///

  const navigate = useNavigate();

  // generate background elements
  const generateGrid = (): JSX.Element[] => {
    const tiles: JSX.Element[] = [];

    const numberOfTiles = 24;
    for (let i = 0; i <= numberOfTiles; i++) tiles.push(<p key={i} className={classes["p-tile"]} />);

    return tiles;
  };

  const generatePawns = (): JSX.Element[] => {
    const pawns: JSX.Element[] = [];

    const numOfPawns = 6;
    for (let i = 0; i <= numOfPawns; i++) {
      // position background pawn
      const leftP = (i * 100) / (numOfPawns - 1);
      const topP = (1 / 200) * Math.pow(-(leftP - 100 / 2), 2) - 8;

      const pawnClass = i % 2 === 0 ? "pawn-black" : "pawn-white";

      pawns.push(
        <div
          key={`pawn-part-${i}`}
          className={`${classes["img-pawn-container"]} ${classes[pawnClass]}`}
          style={{ left: `${leftP}%`, top: `${topP}%` }}
        >
          {Array.from({ length: partOfPawn }).map((_, index: number) => (
            <div key={index} className={classes.pb} />
          ))}
        </div>
      );
    }

    return pawns;
  };
  //*/

  // to go to registration page
  const navigateToRegistration = (regOptions: RegistrationInterface): void => {
    const state: StateOptions = {
      regOption: regOptions,
    };

    navigate("/registration", { state: state });
  };
  //*/

  return (
    <div className={classes.actions}>
      <div className={classes.actions__background}>
        <div className={classes["board-grid"]}>{generateGrid()}</div>
        {generatePawns()}
      </div>

      <div className={classes.actions__content}>
        <div className={classes["actions-pawns"]}>
          {/* sign in pawn */}
          <div
            data-testid="home-pawn-button-sign-in"
            className={`${classes["sign-in-pawn"]} ${classes["pawn-container"]}`}
            onClick={() => {
              navigateToRegistration(RegistrationInterface.signIn);
            }}
          >
            <div className={classes["img-pawn-container"]}>
              {Array.from({ length: partOfPawn }).map((_, index: number) => (
                <div key={index} className={classes.pb} />
              ))}
            </div>

            <p className={classes["img-pawn-text"]}>
              <span>Sign In</span>
            </p>
          </div>
          {/* --- */}

          {/* sign up pawn */}
          <div
            data-testid="home-pawn-button-sign-up"
            className={`${classes["sign-up-pawn"]} ${classes["pawn-container"]}`}
            onClick={() => {
              navigateToRegistration(RegistrationInterface.signUp);
            }}
          >
            <div className={classes["img-pawn-container"]}>
              {Array.from({ length: partOfPawn }).map((_, index: number) => (
                <div key={index} className={classes.pb} />
              ))}
            </div>

            <p className={classes["img-pawn-text"]}>
              <span>Sign Up</span>
            </p>
          </div>
          {/* --- */}
        </div>
      </div>
    </div>
  );
}

export default HomeActions;
