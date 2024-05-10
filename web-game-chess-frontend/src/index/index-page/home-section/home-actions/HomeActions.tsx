import { useNavigate } from 'react-router-dom';
import classes from './HomeActions.module.scss';
import { registrationActions } from '../../../../shared/utils/enums/registrationEnum';

type HomeActionsProps = {};

function HomeActions({}: HomeActionsProps) {
  const partOfPawn = 6;

  const navigate = useNavigate();

  // generate elements
  const generateGrid = (): JSX.Element[] => {
    const tiles: JSX.Element[] = [];

    const numberOfTiles = 25;
    for (let i = 0; i < numberOfTiles; i++) {
      tiles.push(<p key={i} className={classes['p-tile']} />);
    }

    return tiles;
  };

  const generatePawns = (): JSX.Element[] => {
    const pawns: JSX.Element[] = [];

    const numOfPawns = 7;
    for (let i = 0; i < numOfPawns; i++) {
      // position background pawn
      const leftP = (i * 100) / (numOfPawns - 1);
      const topP = (1 / 200) * Math.pow(-(leftP - 100 / 2), 2) - 8;

      const pawnClass = i % 2 === 0 ? 'pawn-black' : 'pawn-white';

      pawns.push(
        <div
          key={i}
          className={`${classes['img-pawn-container']} ${classes[pawnClass]}`}
          style={{ left: `${leftP}%`, top: `${topP}%` }}
        >
          {Array.from({ length: partOfPawn }).map((_, index) => (
            <div key={index} className={classes.pb} />
          ))}
        </div>
      );
    }

    return pawns;
  };
  // end generate elements

  return (
    <div className={classes.actions}>
      <div className={classes.actions__background}>
        <div className={classes['board-grid']}>{generateGrid()}</div>
        {generatePawns()}
      </div>
      <div className={classes.actions__content}>
        <div className={classes['actions-pawns']}>
          {/* sign in pawn */}
          <div
            onClick={() => {
              navigate('/registration', {
                state: { regOption: registrationActions.signIn },
              });
            }}
            className={`${classes['signin-pawn']} ${classes['pawn-container']}`}
          >
            <div className={classes['img-pawn-container']}>
              {Array.from({ length: partOfPawn }).map((_, index) => (
                <div key={index} className={classes.pb} />
              ))}
            </div>
            <p className={classes['img-pawn-text']}>Sign In</p>
          </div>
          {/* end sign in pawn */}

          {/* sign up pawn */}
          <div
            onClick={() => {
              navigate('/registration', {
                state: { regOption: registrationActions.signUp },
              });
            }}
            className={`${classes['signup-pawn']} ${classes['pawn-container']}`}
          >
            <div className={classes['img-pawn-container']}>
              {Array.from({ length: partOfPawn }).map((_, index) => (
                <div key={index} className={classes.pb} />
              ))}
            </div>
            <p className={classes['img-pawn-text']}>Sign Up</p>
          </div>
          {/* end sign up pawn */}
        </div>
      </div>
    </div>
  );
}

export default HomeActions;
