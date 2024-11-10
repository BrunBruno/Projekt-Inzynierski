// stats chart data and options

import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { gameEndReasonIcons } from "../../../../shared/svgs/iconsMap/GameEndReasonIcons";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import {
  ColorValue,
  dangerColor,
  greyColor,
  mainColor,
  successColor,
} from "../../../../shared/utils/objects/colorMaps";
import { ChartObject } from "../../../../shared/utils/types/commonTypes";
import { GetFullUserDto } from "../../../../shared/utils/types/userDtos";

export type StatsConfig = {
  title: string;
  data: ChartObject[];
  colors: ColorValue[];
  stats: (ChartObject & { icon: JSX.Element })[];
};

// to get row stats data
export const getStatsConfig = (type: string, user: GetFullUserDto): StatsConfig | null => {
  switch (type) {
    case "games":
      return {
        title: "Games:",
        data: [
          { id: 0, value: user.outcomeTotal.wins, label: "Win" },
          { id: 1, value: user.outcomeTotal.draws, label: "Draw" },
          { id: 2, value: user.outcomeTotal.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Wins",
            value: user.outcomeTotal.wins,
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 1,
            label: "Draws",
            value: user.outcomeTotal.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 2,
            label: "Loses",
            value: user.outcomeTotal.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    case "wins":
      return {
        title: "Wins by:",
        data: [
          { id: 0, value: user.winsByCheckMate, label: "Mate" },
          { id: 1, value: user.winsByResignation, label: "Resign" },
          { id: 2, value: user.winsByTimeout, label: "Timeout" },
        ],
        colors: [mainColor.c5, mainColor.c7, mainColor.c9],
        stats: [
          {
            id: 0,
            label: "Mate",
            value: user.winsByCheckMate,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"checkMate"} />,
          },
          {
            id: 1,
            label: "Resign",
            value: user.winsByResignation,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"resignation"} />,
          },
          {
            id: 2,
            label: "Timeout",
            value: user.winsByTimeout,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"outOfTime"} />,
          },
        ],
      };

    case "loses":
      return {
        title: "Loses by:",
        data: [
          { id: 0, value: user.losesByCheckMate, label: "Mate" },
          { id: 1, value: user.losesByResignation, label: "Resign" },
          { id: 2, value: user.losesByTimeout, label: "Timeout" },
        ],
        colors: [mainColor.c5, mainColor.c7, mainColor.c9],
        stats: [
          {
            id: 0,
            label: "Mate",
            value: user.losesByCheckMate,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"checkMate"} />,
          },
          {
            id: 1,
            label: "Resign",
            value: user.losesByResignation,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"resignation"} />,
          },
          {
            id: 2,
            label: "Timeout",
            value: user.losesByTimeout,
            icon: <IconCreator icons={gameEndReasonIcons} iconName={"outOfTime"} />,
          },
        ],
      };

    default:
      return null;
  }
};
