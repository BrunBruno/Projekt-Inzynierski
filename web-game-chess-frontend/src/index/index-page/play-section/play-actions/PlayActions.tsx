import { useEffect, useRef, useState } from "react";
import classes from "./PlayActions.module.scss";
import { ElementClass } from "../../../../shared/utils/types/commonTypes";
import { PlayActionsData, playActionsData } from "./PlayActionsData";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { playActionIcons } from "./PlayActionsIcons";

let timeOut: NodeJS.Timeout;

type PlayActionsProps = {};

function PlayActions({}: PlayActionsProps) {
  ///

  const backgroundRef = useRef<HTMLDivElement>(null);

  const [prevCls, setPrevCls] = useState<ElementClass>(classes.active0);
  const [contentCls, setContentCls] = useState<ElementClass>("");

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
    for (let i = 0; i < elements.length; i++) elements[i].classList.remove(prevCls);
    for (let i = 0; i < elements.length; i++) elements[i].classList.add(cls);

    setPrevCls(cls);
  };

  useEffect(() => {
    setContentCls("");
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      setContentCls(prevCls);
    }, 500);
  }, [prevCls]);

  return (
    <section className={classes.play}>
      <div className={classes.play__intro}>
        <h2 className={classes["text"]}>
          <span>What do we offer?</span>
        </h2>
      </div>

      <div className={`${classes.play__content} ${contentCls}`}>
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

      <div ref={backgroundRef} className={`${classes.play__background}`}>
        {Array.from({ length: playActionsData.length }).map((_, index) => (
          <div key={`background-${index}`} className={`${classes.play__background__cube} `}>
            <div className={classes["image-cube"]}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlayActions;
