import React, { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import classes from "./PlaySection.module.scss";
import PlayBoard from "./play-board/PlayBoard";
import { createOneTimeObserver } from "../../../shared/utils/functions/createOneTimeObserver";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import { useNavigate } from "react-router-dom";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { playSectionIcons } from "./PlaySectionIcons";

type PlaySectionProps = {
  // section container ref
  sectionRef: React.RefObject<HTMLElement>;
};

const PlaySection = forwardRef<HandleOnScroll, PlaySectionProps>(
  ({ sectionRef }: PlaySectionProps, ref: ForwardedRef<HandleOnScroll>) => {
    ///

    const navigate = useNavigate();

    // section title ref
    const introRef = useRef<HTMLDivElement>(null);
    const actionRefs: React.RefObject<HTMLDivElement>[] = [];
    for (let i = 0; i < 4; i++) actionRefs[i] = useRef<HTMLDivElement>(null);

    // to activate intro and actions on intersection
    useEffect(() => {
      const introObserverAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.remove(classes["active-intro"]);
      };
      const introObserver: IntersectionObserver = createOneTimeObserver(introObserverAction, {});

      if (introRef.current) {
        introObserver.observe(introRef.current);
      }

      return () => {
        introObserver.disconnect();
      };
    }, [introRef]);

    useEffect(() => {
      const actionsObserverAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.add(classes["show"]);
      };
      const actionsObserver: IntersectionObserver = createOneTimeObserver(actionsObserverAction, {});

      actionRefs.forEach((element) => {
        if (element.current) {
          actionsObserver.observe(element.current);
        }
      });

      return () => {
        actionsObserver.disconnect();
      };
    }, [actionRefs]);
    //*/

    return (
      <section id="play-section" ref={sectionRef} className={classes.section}>
        {/* intro */}
        <div ref={introRef} className={`${classes.section__intro} ${classes["active-intro"]}`}>
          <h2 className={`${classes["intro-h2"]} ${classes["active-h2"]}`}>
            <span>LET'S GET</span>
          </h2>
          <h2 className={`${classes["intro-h2"]} ${classes["active-h2"]}`}>
            <span>STARTED</span>
          </h2>
        </div>
        {/* --- */}

        <div className={classes.section__content}>
          {/* board */}
          <div className={classes.section__content__board}>
            <PlayBoard ref={ref} />
          </div>
          {/* --- */}

          {/* actions */}
          <div className={classes.section__content__actions}>
            <div className={classes.section__content__actions__buttons}>
              <div ref={actionRefs[0]} className={classes["actions-row"]}>
                <h3 className={classes["buttons-title"]}>Start playing now!</h3>
              </div>

              <div ref={actionRefs[1]} className={classes["actions-row"]}>
                <h4 className={classes["buttons-text"]}>
                  Join our community and start playing users at your level or simply join random game and enjoy chess.
                </h4>
              </div>

              <div ref={actionRefs[2]} className={classes["actions-row"]}>
                <button
                  className={classes["vs-player-button"]}
                  onClick={() => {
                    navigate("/main", {
                      state: {},
                    });
                  }}
                >
                  <IconCreator icons={playSectionIcons} iconName="online" />
                  <span>PLAY ONLINE</span>
                </button>
              </div>

              <div ref={actionRefs[3]} className={classes["actions-row"]}>
                <button
                  className={classes["vs-computer-button"]}
                  onClick={() => {
                    navigate("/main", {
                      state: {},
                    });
                  }}
                >
                  <IconCreator icons={playSectionIcons} iconName="offline" />
                  <span>PLAY OFFLINE</span>
                </button>
              </div>
            </div>
          </div>
          {/* --- */}
        </div>
      </section>
    );
  }
);

export default PlaySection;
