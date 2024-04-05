import classes from "./HeroSection.module.scss";

const HeroSection = () => {
  const makeGridBlock = () => {
    const blocks = [];

    for (let i = 0; i < 25; i++) {
      blocks.push(<p key={i} />);
    }

    return (
      <div className={classes.hero__content__extra_bg__grid}>{blocks}</div>
    );
  };

  const generatePawns = () => {
    const blocks = [];

    const numberOfPawns = 7;
    for (let i = 0; i < numberOfPawns; i++) {
      const leftPercentage = (i * 100) / (numberOfPawns - 1);
      const topPercentage =
        (1 / 200) * Math.pow(-(leftPercentage - 100 / 2), 2) - 8;

      const pawnClass = i % 2 === 0 ? "pawn-black" : "pawn-white";

      blocks.push(
        <div
          key={i}
          className={`${classes["img-pawn-container"]} ${classes[pawnClass]}`}
          style={{ top: `${topPercentage}%`, left: `${leftPercentage}%` }}
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

    return blocks;
  };

  return (
    <section id="home" className={classes.hero}>
      <div className={classes.hero__content}>
        <div className={classes.hero__content__intro}>
          <h1>CHESS</h1>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            ipsa quis doloribus. Assumenda eum quisquam, ab optio nemo voluptas
            aperiam incidunt rem, harum eos reprehenderit, eaque fugit! Illum,
            exercitationem minima.
          </span>
        </div>
        <div className={classes.hero__content__extra_bg}>
          {makeGridBlock()}
          {generatePawns()}
        </div>
        <div className={classes.hero__content__extra}>
          <div className={classes["hero-register"]}>
            <div
              className={`${classes["signin-pawn"]} ${classes["pawn-container"]}`}
            >
              <div className={classes["img-pawn-container"]}>
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
              className={`${classes["signup-pawn"]} ${classes["pawn-container"]}`}
            >
              <div className={classes["img-pawn-container"]}>
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
};

export default HeroSection;
