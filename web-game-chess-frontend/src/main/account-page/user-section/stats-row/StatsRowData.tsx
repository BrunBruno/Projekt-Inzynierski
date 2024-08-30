// stats chart data and options

import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { winLoseIcons } from "../../../../shared/svgs/WinLoseIcons";
import { winTypesIcons } from "../../../../shared/svgs/WinTypesIcons";
import { dangerColor, greyColor, mainColor, successColor } from "../../../../shared/utils/enums/colorMaps";
import { ChartObject } from "../../../../shared/utils/types/commonTypes";
import { GetFullUserDto } from "../../../../shared/utils/types/userDtos";

export type StatsConfig = {
  title: string;
  data: ChartObject[];
  colors: string[];
  stats: (ChartObject & { icon: JSX.Element })[];
};

export const getStatsConfig = (type: string, user: GetFullUserDto): StatsConfig | null => {
  switch (type) {
    case "games":
      return {
        title: "Games:",
        data: [
          { id: 0, value: user.wdlTotal.wins, label: "Win" },
          { id: 1, value: user.wdlTotal.draws, label: "Draw" },
          { id: 2, value: user.wdlTotal.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Wins",
            value: user.wdlTotal.wins,
            icon: <IconCreator icons={winLoseIcons} iconName="win" />,
          },
          {
            id: 1,
            label: "Draws",
            value: user.wdlTotal.draws,
            icon: <IconCreator icons={winLoseIcons} iconName="draw" />,
          },
          {
            id: 2,
            label: "Loses",
            value: user.wdlTotal.loses,
            icon: <IconCreator icons={winLoseIcons} iconName="lose" />,
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
            icon: <IconCreator icons={winTypesIcons} iconName="checkmate" />,
          },
          {
            id: 1,
            label: "Resign",
            value: user.winsByResignation,
            icon: <IconCreator icons={winTypesIcons} iconName="resignation" />,
          },
          {
            id: 2,
            label: "Timeout",
            value: user.winsByTimeout,
            icon: <IconCreator icons={winTypesIcons} iconName="outOfTime" />,
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
            icon: <IconCreator icons={winTypesIcons} iconName="checkmate" />,
          },
          {
            id: 1,
            label: "Resign",
            value: user.losesByResignation,
            icon: <IconCreator icons={winTypesIcons} iconName="resignation" />,
          },
          {
            id: 2,
            label: "Timeout",
            value: user.losesByTimeout,
            icon: <IconCreator icons={winTypesIcons} iconName="outOfTime" />,
          },
        ],
      };

    default:
      return null;
  }
};
