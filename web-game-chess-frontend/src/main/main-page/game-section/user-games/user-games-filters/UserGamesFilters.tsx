import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import WinLoseIcons from "../../../../../shared/svgs/WinLoseIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import classes from "./UserGamesFilters.module.scss";
import { resultList, timingTypesList } from "./UserGamesFiltersObects";

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

  return (
    <div className={classes.filters}>
      <div className={classes.filters__row}>
        {timingTypesList.map((element, i) => (
          <p
            key={`type-${i}`}
            className={timingTypeFilters.includes(element.value) ? classes.active : ""}
            onClick={() => {
              activateTimingTypeFilter(element.value);
            }}
          >
            {element.label}
            <TimingTypesIcons
              iconClass={classes["filter-svg"]}
              iconName={element.label.toLocaleLowerCase()}
              color={mainColor.c0}
            />
          </p>
        ))}
      </div>

      <div className={classes.filters__row}>
        <div />
        {resultList.map((element, i) => (
          <p
            key={`result-${i}`}
            className={resultFilters.includes(element.value) ? classes.active : ""}
            onClick={() => {
              activateResultFilter(element.value);
            }}
          >
            {element.label}
            <WinLoseIcons iconName={element.label.toLocaleLowerCase().substring(0, element.label.length - 1)} />
          </p>
        ))}
      </div>
    </div>
  );
}

export default UserGamesFilters;
