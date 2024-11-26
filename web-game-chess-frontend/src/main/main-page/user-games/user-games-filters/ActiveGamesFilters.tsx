import classes from "./UserGamesFilters.module.scss";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { TimingTypeListFilterOption, timingTypeListFilterOptions } from "./UserGamesFiltersData";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { displayFromLowercase } from "../../../../shared/utils/functions/enums";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

type ActiveGamesFiltersProps = {
  // list to filter timing types
  timingTypeFiltersProp: StateProp<TimingType[]>;
};

function ActiveGamesFilters({ timingTypeFiltersProp }: ActiveGamesFiltersProps) {
  ///

  // sets timing type filter list
  const activateTimingTypeFilter = (value: number) => {
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

  return (
    <div className={classes.filters}>
      {/* filter by types */}
      <div className={classes.filters__row}>
        {timingTypeListFilterOptions.map((element: TimingTypeListFilterOption, i) => (
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
    </div>
  );
}

export default ActiveGamesFilters;
