// stats chart data and options

import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { ColorValue, dangerColor, greyColor, successColor } from "../../../../shared/utils/objects/colorMaps";
import { ChartObject } from "../../../../shared/utils/types/commonTypes";
import { GetFriendProfileDto } from "../../../../shared/utils/types/friendshipDtos";
import { friendSectionIcons } from "../FriendSectionIcons";

export type StatsConfig = {
  title: string;
  data: ChartObject[];
  colors: ColorValue[];
  stats: (ChartObject & { icon: JSX.Element })[];
};

// to get row stats data
export const getStatsConfig = (type: string, user: GetFriendProfileDto): StatsConfig | null => {
  switch (type) {
    case "gamesTotal":
      return {
        title: "Games total",
        data: [
          { id: 0, value: user.outcomeTotal.wins, label: "Win" },
          { id: 1, value: user.outcomeTotal.draws, label: "Draw" },
          { id: 2, value: user.outcomeTotal.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Games",
            value: user.outcomeTotal.total,
            icon: <IconCreator icons={friendSectionIcons} iconName={"games"} />,
          },
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

    case "gamesTogether":
      return {
        title: "Games together",
        data: [
          { id: 0, value: user.outcomeTogether.wins, label: "Win" },
          { id: 1, value: user.outcomeTogether.draws, label: "Draw" },
          { id: 2, value: user.outcomeTogether.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Games",
            value: user.outcomeTogether.total,
            icon: <IconCreator icons={friendSectionIcons} iconName={"games"} />,
          },
          {
            id: 0,
            label: "Wins",
            value: user.outcomeTogether.wins,
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 1,
            label: "Draws",
            value: user.outcomeTogether.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 2,
            label: "Loses",
            value: user.outcomeTogether.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    default:
      return null;
  }
};
