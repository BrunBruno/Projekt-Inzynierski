import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import classes from "./InvitationsFilters.module.scss";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

type InvitationsFiltersProps = {
  // list to filter invitations by expiration and setter
  expirationFiltersProps: StateProp<boolean[]>;
};

function InvitationsFilters({ expirationFiltersProps }: InvitationsFiltersProps) {
  ///

  // sets expiration filters
  const activateExpirationFilter = (value: boolean): void => {
    expirationFiltersProps.set((prevTypes: boolean[]) => {
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
      {/* filter by expiration */}
      <div className={classes.filters__row}>
        <div
          className={`
            ${classes.option} 
            ${expirationFiltersProps.get.includes(true) ? classes.active : ""}
          `}
          onClick={() => {
            activateExpirationFilter(true);
          }}
        >
          <span>Active</span>
          <IconCreator icons={symbolIcons} iconName={"success"} iconClass={classes["option-svg"]} />
        </div>

        <div
          className={`
            ${classes.option} 
            ${expirationFiltersProps.get.includes(false) ? classes.active : ""}
          `}
          onClick={() => {
            activateExpirationFilter(false);
          }}
        >
          <span>Active</span>
          <IconCreator icons={symbolIcons} iconName={"error"} iconClass={classes["option-svg"]} />
        </div>
      </div>
    </div>
  );
}

export default InvitationsFilters;
