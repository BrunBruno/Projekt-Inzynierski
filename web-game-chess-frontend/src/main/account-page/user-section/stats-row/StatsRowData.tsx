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
import { userSectionIcons } from "../UserSectionIcons";

// available stats types
export const statsConfigTypes = [
  "onlineGamesStats",
  "onlineGamesWins",
  "onlineGamesLoses",
  "offlineGamesStats",
] as const;
export type StatsConfigType = (typeof statsConfigTypes)[number];

// stat row configuration
export type StatsConfig = {
  title: string;
  data: ChartObject[];
  colors: ColorValue[];
  stats: (ChartObject & { icon: JSX.Element })[];
};

// to get row stats data
export const getStatsConfig = (type: StatsConfigType, user: GetFullUserDto): StatsConfig | null => {
  switch (type) {
    case "onlineGamesStats":
      return {
        title: "Game outcomes:",
        data: [
          { id: 1, value: user.onlineOutcomeTotal.wins, label: "Wins" },
          { id: 2, value: user.onlineOutcomeTotal.draws, label: "Draws" },
          { id: 3, value: user.onlineOutcomeTotal.loses, label: "Loses" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Games",
            value: user.onlineOutcomeTotal.total,
            icon: <IconCreator icons={userSectionIcons} iconName={"games"} />,
          },
          {
            id: 1,
            label: "Wins",
            value: user.onlineOutcomeTotal.wins,
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 2,
            label: "Draws",
            value: user.onlineOutcomeTotal.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 3,
            label: "Loses",
            value: user.onlineOutcomeTotal.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    case "onlineGamesWins":
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
          {
            id: 3,
            label: "",
            value: NaN,
            icon: <></>,
          },
        ],
      };

    case "onlineGamesLoses":
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
          {
            id: 3,
            label: "",
            value: NaN,
            icon: <></>,
          },
        ],
      };

    case "offlineGamesStats":
      return {
        title: "Game outcomes:",
        data: [
          { id: 1, value: user.offlineOutcomeTotal.wins, label: "Wins" },
          { id: 2, value: user.offlineOutcomeTotal.draws, label: "Draws" },
          { id: 3, value: user.offlineOutcomeTotal.loses, label: "Loses" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Games",
            value: user.offlineOutcomeTotal.total,
            icon: <IconCreator icons={userSectionIcons} iconName={"games"} />,
          },
          {
            id: 1,
            label: "Wins",
            value: user.offlineOutcomeTotal.wins,
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 2,
            label: "Draws",
            value: user.offlineOutcomeTotal.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 3,
            label: "Loses",
            value: user.offlineOutcomeTotal.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    default:
      return null;
  }
};
