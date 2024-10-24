import { Dispatch, SetStateAction } from "react";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../../shared/utils/objects/colorMaps";
import { TimingTypeName } from "../../../../../shared/utils/objects/constantLists";
import classes from "./ActiveGamesFilters.module.scss";
import { timingTypeList } from "./ActiveGamesFiltersData";
import { TimingType } from "../../../../../shared/utils/objects/entitiesEnums";

type ActiveGamesFiltersProps = {
  // list to filter timing types
  timingTypeFilters: number[];
  setTimingTypeFilters: Dispatch<SetStateAction<TimingType[]>>;
};

function ActiveGamesFilters({ timingTypeFilters, setTimingTypeFilters }: ActiveGamesFiltersProps) {
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
    </div>
  );
}

export default ActiveGamesFilters;
