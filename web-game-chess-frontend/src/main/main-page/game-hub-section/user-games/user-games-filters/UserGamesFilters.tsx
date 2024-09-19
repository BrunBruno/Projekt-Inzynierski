import { Dispatch, SetStateAction } from "react";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../../shared/utils/objects/colorMaps";
import { GameResultName, TimingTypeName } from "../../../../../shared/utils/objects/constantLists";
import classes from "./UserGamesFilters.module.scss";
import { resultList, timingTypeList } from "./UserGamesFiltersData";
import { TimingType } from "../../../../../shared/utils/objects/entitiesEnums";
import { gameResultIcons } from "../../../../../shared/svgs/iconsMap/GameResultIcons";

type UserGamesFiltersProps = {
  // list to filter timing types
  timingTypeFilters: number[];
  // set timing list
  setTimingTypeFilters: Dispatch<SetStateAction<TimingType[]>>;
  // list to filter result of the game
  resultFilters: (boolean | null)[];
  // set result list
  setResultFilters: Dispatch<SetStateAction<(boolean | null)[]>>;
};

function UserGamesFilters({
  timingTypeFilters,
  setTimingTypeFilters,
  resultFilters,
  setResultFilters,
}: UserGamesFiltersProps) {
  ///

  // sets timing type filter list
  const activateTimingTypeFilter = (value: number) => {
    setTimingTypeFilters((prevTypes) => {
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
  const activateResultFilter = (value: boolean | null) => {
    setResultFilters((prevTypes) => {
      const newTypes = [...prevTypes];
      if (newTypes.includes(value)) {
        newTypes.splice(newTypes.indexOf(value), 1);
      } else {
        newTypes.push(value);
      }

      return newTypes;
    });
  };
  //*/

  return (
    <div className={classes.filters}>
      {/* filter by types */}
      <div className={classes.filters__row}>
        {timingTypeList.map((element, i) => (
          <div
            key={`type-${i}`}
            className={`
              ${classes.option} 
              ${timingTypeFilters.includes(element.value) ? classes.active : ""}
            `}
            onClick={() => {
              activateTimingTypeFilter(element.value);
            }}
          >
            <span>{element.label}</span>
            <IconCreator
              icons={timingTypeIcons}
              iconName={element.label.toLocaleLowerCase() as TimingTypeName}
              color={mainColor.c0}
              iconClass={classes["option-svg"]}
            />
          </div>
        ))}
      </div>
      {/* --- */}

      {/* filter by result */}
      <div className={classes.filters__row}>
        <div />
        {resultList.map((element, i) => (
          <div
            key={`result-${i}`}
            className={`
              ${classes.option} 
              ${resultFilters.includes(element.value) ? classes.active : ""}
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
      {/* --- */}
    </div>
  );
}

export default UserGamesFilters;
