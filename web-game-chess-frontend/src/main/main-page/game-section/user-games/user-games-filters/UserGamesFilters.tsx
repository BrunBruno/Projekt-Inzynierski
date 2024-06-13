import { MouseEvent } from "react";
import classes from "./UserGamesFilters.module.scss";
import { gameResultList, timingTypesList } from "./UserGamesFiltersObects";

type UserGamesFiltersProps = {
  setTimingTypeFilters: React.Dispatch<React.SetStateAction<number[]>>;
};

function UserGamesFilters({ setTimingTypeFilters }: UserGamesFiltersProps) {
  const activateFilter = (
    event: MouseEvent<HTMLParagraphElement, globalThis.MouseEvent>,
    value: number
  ) => {
    const target = event.target as HTMLElement;

    setTimingTypeFilters((prevTypes) => {
      const newTypes = [...prevTypes];
      if (newTypes.includes(value)) {
        newTypes.splice(newTypes.indexOf(value), 1);
        target.classList.remove(classes.active);
      } else {
        newTypes.push(value);
        target.classList.add(classes.active);
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
            className={classes.active}
            onClick={(event) => {
              activateFilter(event, element.value);
            }}
          >
            {element.label}
          </p>
        ))}
      </div>
      <div className={classes.filters__row}>
        {gameResultList.map((element, i) => (
          <p
            key={`result-${i}`}
            className={classes.active}
            onClick={(event) => {
              // activateFilter(event,  element.value);
            }}
          >
            {element}
          </p>
        ))}
      </div>
    </div>
  );
}

export default UserGamesFilters;
