import WinLoseIcons from "../../../../shared/svgs/WinLoseIcons";
import WinTypesIcons from "../../../../shared/svgs/WinTypesIcons";
import {
  dangerColor,
  greyColor,
  mainColor,
  successColor,
} from "../../../../shared/utils/enums/colorMaps";
import { GetFullUserDto } from "../../../../shared/utils/types/userDtos";

type StatsConfig = {
  title: string;
  data: {
    id: number;
    value: number;
    label: string;
  }[];
  colors: string[];
  stats: {
    label: string;
    value: number;
    icon: JSX.Element;
  }[];
};

export const getStatsConfig = (
  type: string,
  user: GetFullUserDto
): StatsConfig | null => {
  switch (type) {
    case "games":
      return {
        title: "Games:",
        data: [
          { id: 0, value: user.wins, label: "Win" },
          { id: 1, value: user.draws, label: "Draw" },
          { id: 2, value: user.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            label: "Wins",
            value: user.wins,
            icon: <WinLoseIcons iconName="win" />,
          },
          {
            label: "Draws",
            value: user.draws,
            icon: <WinLoseIcons iconName="draw" />,
          },
          {
            label: "Loses",
            value: user.loses,
            icon: <WinLoseIcons iconName="lose" />,
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
            label: "Mate",
            value: user.winsByCheckMate,
            icon: <WinTypesIcons iconName="checkmate" />,
          },
          {
            label: "Resign",
            value: user.winsByResignation,
            icon: <WinTypesIcons iconName="resignation" />,
          },
          {
            label: "Timeout",
            value: user.winsByTimeout,
            icon: <WinTypesIcons iconName="outoftime" />,
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
            label: "Mate",
            value: user.losesByCheckMate,
            icon: <WinTypesIcons iconName="checkmate" />,
          },
          {
            label: "Resign",
            value: user.losesByResignation,
            icon: <WinTypesIcons iconName="resignation" />,
          },
          {
            label: "Timeout",
            value: user.losesByTimeout,
            icon: <WinTypesIcons iconName="outoftime" />,
          },
        ],
      };
    default:
      return null;
  }
};
