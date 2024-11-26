import { Dispatch, SetStateAction } from "react";
import classes from "./InviteBy.module.scss";

type InviteByUrlProps = {
  // to set obtained url
  setSelectedByUrl: Dispatch<SetStateAction<boolean>>;
};

function InviteByUrl({ setSelectedByUrl }: InviteByUrlProps) {
  ///

  // to display time selection for generating new game link
  const onSelectByUrl = (): void => {
    setSelectedByUrl(true);
  };

  return (
    <div className={classes.invite}>
      <p className={classes.header}>
        <span>Invite By Link</span>
      </p>

      <p className={classes.text}>
        Click "Generate" to create a unique invite link that you can share with your friends.
      </p>

      <div className={classes["input-holder"]}>
        <button
          className={classes["generate-button"]}
          onClick={() => {
            onSelectByUrl();
          }}
        >
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
}

export default InviteByUrl;
