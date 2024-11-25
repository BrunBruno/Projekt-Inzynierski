import { RefObject } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import AvatarIcon from "../../../../shared/svgs/icons/AvatarIcon";
import classes from "./FriendEmptyCard.module.scss";

const cardCount = 16;

type FriendEmptyCardProps = {
  // to display loading page when data is still fetched
  isLoaded: boolean;
  // for settings paged size
  firstEmptyCardRef: RefObject<HTMLDivElement>;
};

function FriendEmptyCard({ isLoaded, firstEmptyCardRef }: FriendEmptyCardProps) {
  ///

  return (
    <div className={classes.empty}>
      <div className={classes["no-data"]}>{!isLoaded && <LoadingPage text="Loading data" />}</div>

      {Array.from({ length: cardCount }).map((_, i: number) => (
        <div ref={i === 0 ? firstEmptyCardRef : null} key={`empty-card-${i}`} className={classes["empty-card"]}>
          <AvatarIcon iconClass={classes["blank-avatar"]} />
          <p className={classes["blank-text"]} />
          <p className={classes["blank-text"]} />
        </div>
      ))}
    </div>
  );
}

export default FriendEmptyCard;
