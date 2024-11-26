import classes from "./InviteBy.module.scss";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { delayAction } from "../../../../shared/utils/functions/events";

type InviteBySelectionProps = {
  // to filter friend by username
  setSelectedUsername: Dispatch<SetStateAction<string>>;
};

function InviteBySelection({ setSelectedUsername }: InviteBySelectionProps) {
  ///

  // to filter users by names
  const onSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();

    setSelectedUsername(username);
  };

  return (
    <div className={classes.invite}>
      <p className={classes.header}>
        <span>Search among friends:</span>
      </p>

      <p className={classes.text}>
        Type your friend's username in the search bar to find them quickly and send an invite.
      </p>

      <div className={classes["input-holder"]}>
        <input
          className={classes["input-search"]}
          placeholder="friend-username"
          onChange={(event) => {
            delayAction(() => {
              onSearch(event);
            }, 200);
          }}
        />
      </div>
    </div>
  );
}

export default InviteBySelection;
