// stats chart data and options

import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { ColorValue, dangerColor, greyColor, successColor } from "../../../../shared/utils/objects/colorMaps";
import { ChartObject } from "../../../../shared/utils/types/commonTypes";
import { GetFriendProfileDto } from "../../../../shared/utils/types/friendshipDtos";

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
        title: "All games:",
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
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 1,
            label: "Draws",
            value: user.wdlTotal.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 2,
            label: "Loses",
            value: user.wdlTotal.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    case "gamesTogether":
      return {
        title: "Games with you",
        data: [
          { id: 0, value: user.wdlTogether.wins, label: "Win" },
          { id: 1, value: user.wdlTogether.draws, label: "Draw" },
          { id: 2, value: user.wdlTogether.loses, label: "Lose" },
        ],
        colors: [successColor.mid, greyColor.c6, dangerColor.mid],
        stats: [
          {
            id: 0,
            label: "Wins",
            value: user.wdlTogether.wins,
            icon: <IconCreator icons={gameResultIcons} iconName={"win"} />,
          },
          {
            id: 1,
            label: "Draws",
            value: user.wdlTogether.draws,
            icon: <IconCreator icons={gameResultIcons} iconName={"draw"} />,
          },
          {
            id: 2,
            label: "Loses",
            value: user.wdlTogether.loses,
            icon: <IconCreator icons={gameResultIcons} iconName={"lose"} />,
          },
        ],
      };

    default:
      return null;
  }
};
