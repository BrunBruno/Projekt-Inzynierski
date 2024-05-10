import { useState } from 'react';
import classes from './GameSection.module.scss';
import VsPlayerSearch from './vs-player-search/VsPlayerSearch';

function GameSection() {
  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<></>);

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        <div className={classes.game__content__col}>
          <div className={classes['game-interface']}>{interfaceContent}</div>
        </div>
        <div className={classes.game__content__col}>
          <div className={classes['game-buttons']}>
            <button
              onClick={() => {
                setInterfaceContent(<VsPlayerSearch />);
              }}
            >
              Play vs Player
            </button>
            <button>Play vs Computer</button>
            <button>Play vs Firiend</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameSection;
