import AvatarIcon from "../../../../shared/svgs/icons/AvatarIcon";
import classes from "./FriendEmptyCard.module.scss";

type FriendEmptyCardProps = {};

function FriendEmptyCard({}: FriendEmptyCardProps) {
  ///

  const cardCount = 16;

  return (
    <div className={classes.empty}>
      <div className={classes["no-data"]}>
        <span>You don't have any friends yet.</span>
      </div>

      {Array.from({ length: cardCount }).map((_, i) => (
        <div key={i} className={classes["empty-card"]}>
          <AvatarIcon iconClass={classes["blank-avatar"]} />
          <p className={classes["blank-text"]} />
          <p className={classes["blank-text"]} />
        </div>
      ))}
    </div>
  );
}

export default FriendEmptyCard;
