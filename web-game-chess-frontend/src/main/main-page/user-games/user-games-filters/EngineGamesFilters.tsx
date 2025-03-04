import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { GameResultName } from "../../../../shared/utils/objects/constantLists";
import classes from "./UserGamesFilters.module.scss";
import { ResultListFilterOption, resultListFilterOptions } from "./UserGamesFiltersData";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

type EngineGamesFiltersProps = {
  // list to filter result of the game
  resultFiltersProp: StateProp<(boolean | null)[]>;
};

function EngineGamesFilters({ resultFiltersProp }: EngineGamesFiltersProps) {
  ///

  // sets game result filter list
  const activateResultFilter = (value: boolean | null): void => {
    resultFiltersProp.set((prevTypes) => {
      const newTypes = [...prevTypes];
      if (newTypes.includes(value)) {
        newTypes.splice(newTypes.indexOf(value), 1);
      } else {
        newTypes.push(value);
      }

      return newTypes;
    });
  };

  return (
    <div className={classes.filters}>
      {/* filter by result */}
      <div className={`${classes.filters__row} ${classes["sm-row"]}`}>
        {resultListFilterOptions.map((element: ResultListFilterOption, i: number) => (
          <div
            key={`result-${i}`}
            className={`
              ${classes.option} 
              ${resultFiltersProp.get.includes(element.value) ? classes.active : ""}
            `}
            onClick={() => {
              activateResultFilter(element.value);
            }}
          >
            <span>{element.label}</span>
            <IconCreator
              icons={gameResultIcons}
              iconName={element.label.toLocaleLowerCase().substring(0, element.label.length - 1) as GameResultName}
              iconClass={classes["option-svg"]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EngineGamesFilters;
