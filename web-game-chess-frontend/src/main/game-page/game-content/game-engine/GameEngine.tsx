import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { gameLeftSideBarIcons } from "../../game-left-sidebar/GameLeftSidebarIcons";
import classes from "./GameEngine.module.scss";

const levels: number = 20;

type GameEngineProps = {};

function GameEngine({}: GameEngineProps) {
  ///

  const onChangeEngineLevel = async (level: number): Promise<void> => {
    console.log("tododo", level);
  };

  const onCancel = (): void => {};

  return (
    <div className={classes.bot__content__level__grid}>
      <div
        className={classes["x"]}
        onClick={() => {
          onCancel();
        }}
      >
        <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c5} />
      </div>

      {Array.from({ length: levels }).map((_, level: number) => (
        <div
          key={`engine-level-${level}`}
          className={`
            ${classes["engine-level"]}
        `}
          //${gameOptions.engineLevel === level + 1 ? classes["selected"] : ""}
          onClick={() => {
            onChangeEngineLevel(level + 1);
          }}
        >
          <span>{level + 1}</span>
          <IconCreator icons={gameLeftSideBarIcons} iconName={"engine"} iconClass={classes["lvl-icon"]} />
        </div>
      ))}
    </div>
  );
}

export default GameEngine;
