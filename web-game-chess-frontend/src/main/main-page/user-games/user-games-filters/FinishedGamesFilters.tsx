import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { GameResultName, TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import classes from "./UserGamesFilters.module.scss";
import {
  ResultListFilterOption,
  resultListFilterOptions,
  TimingTypeListFilterOption,
  timingTypeListFilterOptions,
} from "./UserGamesFiltersData";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { displayFromLowercase } from "../../../../shared/utils/functions/enums";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

type FinishedGamesFiltersProps = {
  // list to filter timing types
  timingTypeFiltersProp: StateProp<TimingType[]>;
  // list to filter result of the game
  resultFiltersProp: StateProp<(boolean | null)[]>;
};

function FinishedGamesFilters({ timingTypeFiltersProp, resultFiltersProp }: FinishedGamesFiltersProps) {
  ///

  // sets timing type filter list
  const activateTimingTypeFilter = (value: number): void => {
    timingTypeFiltersProp.set((prevTypes) => {
      const newTypes = [...prevTypes];
      if (newTypes.includes(value)) {
        newTypes.splice(newTypes.indexOf(value), 1);
      } else {
        newTypes.push(value);
      }

      return newTypes;
    });
  };

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
      {/* filter by types */}
      <div className={classes.filters__row}>
        {timingTypeListFilterOptions.map((element: TimingTypeListFilterOption, i: number) => (
          <div
            key={`type-${i}`}
            className={`
              ${classes.option} 
              ${timingTypeFiltersProp.get.includes(element.value) ? classes.active : ""}
            `}
            onClick={() => {
              activateTimingTypeFilter(element.value);
            }}
          >
            <span>{displayFromLowercase(element.label)}</span>
            <IconCreator
              icons={timingTypeIcons}
              iconName={element.label.toLocaleLowerCase() as TimingTypeName}
              color={mainColor.c0}
              iconClass={classes["option-svg"]}
            />
          </div>
        ))}
      </div>

      {/* filter by result */}
      <div className={classes.filters__row}>
        <div />
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

export default FinishedGamesFilters;
