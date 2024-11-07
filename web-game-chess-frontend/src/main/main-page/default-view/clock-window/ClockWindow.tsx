import { useEffect, useRef, useState } from "react";
import classes from "./ClockWindow.module.scss";
import { GetTotalGamesStatsDto } from "../../../../shared/utils/types/gameDtos";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GetTotalGamesStatsModel } from "../../../../shared/utils/types/gameModels";
import axios from "axios";
import { getAuthorization, webGameController } from "../../../../shared/utils/services/ApiService";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultViewIcons } from "../DefaultViewIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";

type ClockWindowProps = {};

function ClockWindow({}: ClockWindowProps) {
  ///

  const { showPopup } = usePopup();

  const hourHandRef = useRef<HTMLDivElement>(null);
  const minHandRef = useRef<HTMLDivElement>(null);
  const secHandRef = useRef<HTMLDivElement>(null);

  const [gamesStats, setGamesStats] = useState<GetTotalGamesStatsDto | null>(null);

  useEffect(() => {
    const setTime = (): void => {
      const date = new Date();

      const hourRotation = 360 * (date.getHours() / 12) + 90;
      const minRotation = 360 * (date.getMinutes() / 60) + 90;
      const secRotation = 360 * (date.getSeconds() / 60) + 90;

      if (hourHandRef.current)
        hourHandRef.current.style.transform = `rotateZ(${hourRotation}deg) translate(-50% ,-50%)`;
      if (minHandRef.current) minHandRef.current.style.transform = `rotateZ(${minRotation}deg) translate(-50% ,-50%)`;
      if (secHandRef.current) secHandRef.current.style.transform = `rotateZ(${secRotation}deg) translate(-50% ,-50%)`;
    };

    setTime();
    const interval = setInterval(setTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getGamesStats = async (): Promise<void> => {
      const model: GetTotalGamesStatsModel = {};

      try {
        const response = await axios.get<GetTotalGamesStatsDto>(
          webGameController.getTotalGamesStats(model),
          getAuthorization()
        );

        setGamesStats(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGamesStats();
  }, []);

  if (!gamesStats) return <></>;

  return (
    <div className={classes.clock}>
      <div className={classes.clock__data}>
        <div className={classes["total-users"]}>
          <IconCreator
            icons={defaultViewIcons}
            iconName={"users"}
            iconClass={classes["block-icon"]}
            color={greyColor.c0}
          />
          <span>Users joined</span>
          <span>{gamesStats.usersJoined}</span>
        </div>

        <div className={classes["total-games"]}>
          <IconCreator
            icons={defaultViewIcons}
            iconName={"games"}
            iconClass={classes["block-icon"]}
            color={greyColor.c0}
          />
          <span>Games today</span>
          <span>{gamesStats.gamesPlayed}</span>
        </div>
      </div>

      <div className={classes.clock__face}>
        <div ref={hourHandRef} className={classes["hour-hand"]} />
        <div ref={minHandRef} className={classes["min-hand"]} />
        <div ref={secHandRef} className={classes["sec-hand"]} />
      </div>
    </div>
  );
}

export default ClockWindow;
