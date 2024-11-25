import { Dispatch, SetStateAction } from "react";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../../shared/utils/objects/colorMaps";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendCard.module.scss";

type FriendCardProps = {
  // friend data from map
  friend: GetAllFriendsByStatusDto;
  // to select user on "invite" button click
  setSelectedFriend: Dispatch<SetStateAction<GetAllFriendsByStatusDto | null>>;
};

function FriendCard({ friend, setSelectedFriend }: FriendCardProps) {
  ///

  return (
    <div key={friend.friendshipId.toString()} className={classes.card}>
      <AvatarImage
        username={friend.username}
        profilePicture={friend.profilePicture}
        containerClass={classes.avatar}
        imageClass={classes["user-avatar"]}
      />

      <div className={classes.data}>
        <h3 className={classes["username"]}>{friend.username}</h3>

        <div className={classes.elo}>
          <span>
            <IconCreator icons={timingTypeIcons} iconClass={classes.icon} iconName={"bullet"} color={mainColor.c0} />
            <span>{friend.elo.bullet}</span>
          </span>

          <span>
            <IconCreator icons={timingTypeIcons} iconClass={classes.icon} iconName={"blitz"} color={mainColor.c0} />
            <span>{friend.elo.blitz}</span>
          </span>

          <span>
            <IconCreator icons={timingTypeIcons} iconClass={classes.icon} iconName={"rapid"} color={mainColor.c0} />
            <span>{friend.elo.rapid}</span>
          </span>

          <span>
            <IconCreator icons={timingTypeIcons} iconClass={classes.icon} iconName={"classic"} color={mainColor.c0} />
            <span>{friend.elo.classic}</span>
          </span>

          <span>
            <IconCreator icons={timingTypeIcons} iconClass={classes.icon} iconName={"daily"} color={mainColor.c0} />
            <span>{friend.elo.daily}</span>
          </span>
        </div>

        <div className={classes["previous-games"]}>
          <p className={classes["outcome-total"]}>You played {friend.outcomeTogether.total} games together </p>
          <span>{friend.outcomeTogether.wins}W</span>
          {" - "}
          <span>{friend.outcomeTogether.draws}D</span>
          {" - "}
          <span>{friend.outcomeTogether.loses}L</span>
        </div>
      </div>

      <div className={classes.invite}>
        <button
          data-testid="vs-friend-invite-to-game-button"
          className={classes["invite-button"]}
          onClick={() => {
            setSelectedFriend(friend);
          }}
        >
          <span>Invite</span>
        </button>
      </div>
    </div>
  );
}

export default FriendCard;
