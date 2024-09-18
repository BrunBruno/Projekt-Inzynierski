import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../../shared/svgs/iconsMap/SymbolIcons";
import classes from "./InvitationsFilters.module.scss";

type InvitationsFiltersProps = {
  // list to filter invitations by expiration
  expirationFilters: boolean | null;
  // set expiration filters list
  setExpirationFilters: React.Dispatch<React.SetStateAction<boolean | null>>;
};

function InvitationsFilters({ expirationFilters, setExpirationFilters }: InvitationsFiltersProps) {
  ///

  // sets expiration filters
  const activateExpirationFilter = () => {};
  //*/

  return (
    <div className={classes.filters}>
      {/* filter by expiration */}
      <div className={classes.filters__row}>
        <div
          className={`
                ${classes.option} 
                ${expirationFilters === true ? classes.active : ""}
            `}
          onClick={() => {
            activateExpirationFilter();
          }}
        >
          <span>Active</span>
          <IconCreator icons={symbolIcons} iconName={"success"} iconClass={classes["option-svg"]} />
        </div>

        <div
          className={`
                ${classes.option} 
                ${expirationFilters === false ? classes.active : ""}
            `}
          onClick={() => {
            activateExpirationFilter();
          }}
        >
          <span>Active</span>
          <IconCreator icons={symbolIcons} iconName={"error"} iconClass={classes["option-svg"]} />
        </div>
      </div>
      {/* --- */}
    </div>
  );
}

export default InvitationsFilters;
