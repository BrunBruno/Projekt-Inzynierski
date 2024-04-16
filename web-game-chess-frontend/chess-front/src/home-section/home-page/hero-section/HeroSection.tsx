import { generateRandomId } from '../../../shared/functions/Functions';

import classes from './HeroSection.module.scss';

import LogoIconSvg from '../../../shared/svgs/LogoIconSvg';
import { useEffect, useRef } from 'react';

const defsIds = {
  id0: generateRandomId(),
  id1: generateRandomId(),
  id2: generateRandomId(),
  id3: generateRandomId(),
  id4: generateRandomId(),
  id5: generateRandomId(),
  id6: generateRandomId(),
};

function HeroSection() {
  const h = window.innerHeight * 0.7;
  const pawnSectionNumber = 6;

  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleHeroOnScroll = () => {
      const element = heroRef.current;

      if (element) {
        const y = window.scrollY;

        if (y < element.clientHeight * 1.5) {
          const brightness =
            -100 / (1 + Math.pow(Math.E, -(y - h) / 100)) + 100;

          element.style.filter = `brightness(${brightness}%)`;
        }
      }
    };

    window.addEventListener('scroll', handleHeroOnScroll);

    return () => {
      window.removeEventListener('scroll', handleHeroOnScroll);
    };
  }, [heroRef]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, [videoRef]);

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
          {Array.from({ length: pawnSectionNumber }).map((_, index) => (
            <div key={index} />
          ))}
        </div>
      );
    }

    return pawns;
  };

  return (
    <section id="home-section" className={classes.hero}>
      <div ref={heroRef} className={classes.hero__content}>
        <div className={classes.hero__content__background}>
          <video ref={videoRef} autoPlay loop muted>
            <source src="videos/hero-background.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={classes['nav-logo']}>
          <a href="/">
            <LogoIconSvg iconClass={classes['logo-svg']} defsIds={defsIds} />
          </a>
          <p>Chess</p>
        </div>

        <div className={classes.hero__content__intro}>
          <h1>
            Welcome to <br /> BRN Chess
          </h1>
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
                {Array.from({ length: pawnSectionNumber }).map((_, index) => (
                  <div key={index} />
                ))}
              </div>
              <p>Sign In</p>
            </div>
            <div
              className={`${classes['signup-pawn']} ${classes['pawn-container']}`}
            >
              <div className={classes['img-pawn-container']}>
                {Array.from({ length: pawnSectionNumber }).map((_, index) => (
                  <div key={index} />
                ))}
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
