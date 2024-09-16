import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../../../shared/svgs/iconsMap/TimingTypesIcons";
import { winLoseIcons } from "../../../../../shared/svgs/iconsMap/WinLoseIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import classes from "./UserGamesFilters.module.scss";
import { resultList, timingTypesList } from "./UserGamesFiltersData";

type UserGamesFiltersProps = {
  // list to filter timing types
  timingTypeFilters: number[];
  // set timing list
  setTimingTypeFilters: React.Dispatch<React.SetStateAction<number[]>>;
  // list to filter result of the game
  resultFilters: (boolean | null)[];
  // set result list
  setResultFilters: React.Dispatch<React.SetStateAction<(boolean | null)[]>>;
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
        {timingTypesList.map((element, i) => (
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
              icons={timingTypesIcons}
              iconName={element.label.toLocaleLowerCase()}
              color={mainColor.c0}
              iconClass={classes["option-icon"]}
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
              icons={winLoseIcons}
              iconName={element.label.toLocaleLowerCase().substring(0, element.label.length - 1)}
              iconClass={classes["option-icon"]}
            />
          </div>
        ))}
      </div>
      {/* --- */}
    </div>
  );
}

export default UserGamesFilters;
