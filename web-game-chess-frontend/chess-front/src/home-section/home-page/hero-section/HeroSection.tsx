import classes from './HeroSection.module.scss';

function HeroSection() {
  const generateGrid = (): JSX.Element[] => {
    const tiles: JSX.Element[] = [];

    const numberOfTiles = 25;
    for (let i = 0; i < numberOfTiles; i++) {
      tiles.push(<p key={i} />);
    }

    return tiles;
  };

  const generatePawns = (): JSX.Element[] => {
    const pawns: JSX.Element[] = [];

    const numOfPawns = 7;
    for (let i = 0; i < numOfPawns; i++) {
      const leftP = (i * 100) / (numOfPawns - 1);
      const topP = (1 / 200) * Math.pow(-(leftP - 100 / 2), 2) - 8;

      const pawnClass = i % 2 === 0 ? 'pawn-black' : 'pawn-white';

      pawns.push(
        <div
          key={i}
          className={`${classes['img-pawn-container']} ${classes[pawnClass]}`}
          style={{ left: `${leftP}%`, top: `${topP}%` }}
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    }

    return pawns;
  };

  return (
    <section id="home-section" className={classes.hero}>
      <div className={classes.hero__content}>
        <div className={classes.hero__content__bg}></div>

        <div className={classes.hero__content__intro}>
          <h1>Welcome to BRN Chess</h1>
          <span>
            Welcome to the fascinating world of chess! Chess is one of the most
            popular and enduring games in the world, with millions of people
            playing and enjoying it every day. It is a game of strategy, logic,
            and skill, where players must use their wits and experience to
            outmaneuver their opponents and claim victory on the board.
          </span>
        </div>
        <div className={classes.hero__content__extra_bg}>
          <div className={classes['board-grid']}>{generateGrid()}</div>
          {generatePawns()}
        </div>
        <div className={classes.hero__content__extra}>
          <div className={classes['hero-actions']}>
            <div
              className={`${classes['signin-pawn']} ${classes['pawn-container']}`}
            >
              <div className={classes['img-pawn-container']}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
              <p>Sign In</p>
            </div>
            <div
              className={`${classes['signup-pawn']} ${classes['pawn-container']}`}
            >
              <div className={classes['img-pawn-container']}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
              <p>Sign Up</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
