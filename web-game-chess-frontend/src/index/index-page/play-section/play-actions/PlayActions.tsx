import { useRef, useState } from "react";
import classes from "./PlayActions.module.scss";
import { ElementClass } from "../../../../shared/utils/types/commonTypes";
import { PlayActionsData, playActionsData } from "./PlayActionsData";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { playActionIcons } from "./PlayActionsIcons";

type PlayActionsProps = {};

function PlayActions({}: PlayActionsProps) {
  ///

  const backgroundRef = useRef<HTMLDivElement>(null);

  const [prevCls, setPrevCls] = useState<ElementClass>(classes.active0);

  const onRotate = (index: number): void => {
    let cls: ElementClass = "";

    switch (index) {
      case 0:
        cls = classes.active0;
        break;
      case 1:
        cls = classes.active1;
        break;
      case 2:
        cls = classes.active2;
        break;
      case 3:
        cls = classes.active3;
        break;
    }

    const bgElement = backgroundRef.current;
    if (!bgElement) return;

    const elements = bgElement.children;
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(prevCls);
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add(cls);
    }

    setPrevCls(cls);
  };

  return (
    <section className={classes.play}>
      {/* <div className={classes.play__intro}>
        <h2 className={classes["text"]}>
          <span>What do we offer?</span>
        </h2>
      </div> */}

      <div className={classes.play__content}>
        {playActionsData.map((action: PlayActionsData, index: number) => (
          <div
            key={`play-action-${index}`}
            className={classes.play__content__cube}
            onMouseEnter={() => {
              onRotate(index);
            }}
          >
            <div className={classes["action-data"]}>
              <IconCreator icons={playActionIcons} iconName={action.iconName} iconClass={classes["action-icon"]} />

              <h3>{action.header}</h3>
              <p>{action.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div ref={backgroundRef} className={`${classes.play__background} ${prevCls}`}>
        {Array.from({ length: playActionsData.length }).map((_, index) => (
          <div key={`background-${index}`} className={`${classes.play__background__cube} ${classes.active0}`}>
            <div className={classes["image-cube"]}>
              <span>{/* bg1 */}</span>
              <span>{/* bg2 */}</span>
              <span>{/* bg3 */}</span>
              <span>{/* bg4 */}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlayActions;