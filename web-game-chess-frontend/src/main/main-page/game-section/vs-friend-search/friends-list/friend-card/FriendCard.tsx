import AvatarImage from "../../../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../../../../shared/svgs/iconsMap/TimingTypesIcons";
import { mainColor } from "../../../../../../shared/utils/enums/colorMaps";
import { GetAllFriendsByStatusDto } from "../../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendCard.module.scss";

type FriendCardProps = {
  // friend data
  friend: GetAllFriendsByStatusDto;
  // to select user on "invite" button click
  setSelectedFriend: React.Dispatch<React.SetStateAction<GetAllFriendsByStatusDto | null>>;
};

function FriendCard({ friend, setSelectedFriend }: FriendCardProps) {
  ///

  return (
    <div key={friend.friendshipId.toString()} className={classes.card}>
      <AvatarImage
        username={friend.username}
        imageUrl={friend.imageUrl}
        containerClass={classes.avatar}
        imageClass={classes["user-avatar"]}
      />

      <div className={classes.data}>
        <h3 className={classes["username"]}>{friend.username}</h3>

        <div className={classes.elo}>
          <span>
            <IconCreator icons={timingTypesIcons} iconClass={classes.icon} iconName="bullet" color={mainColor.c0} />
            <span>{friend.elo.bullet}</span>
          </span>

          <span>
            <IconCreator icons={timingTypesIcons} iconClass={classes.icon} iconName="blitz" color={mainColor.c0} />
            <span>{friend.elo.blitz}</span>
          </span>

          <span>
            <IconCreator icons={timingTypesIcons} iconClass={classes.icon} iconName="rapid" color={mainColor.c0} />
            <span>{friend.elo.rapid}</span>
          </span>

          <span>
            <IconCreator icons={timingTypesIcons} iconClass={classes.icon} iconName="classic" color={mainColor.c0} />
            <span>{friend.elo.classic}</span>
          </span>

          <span>
            <IconCreator icons={timingTypesIcons} iconClass={classes.icon} iconName="daily" color={mainColor.c0} />
            <span>{friend.elo.daily}</span>
          </span>
        </div>

        <div className={classes["previous-games"]}>
          <p className={classes["wdl-total"]}>You played {friend.wdlTogether.total} games together </p>
          <span>{friend.wdlTogether.wins}W</span>
          {" - "}
          <span>{friend.wdlTogether.draws}D</span>
          {" - "}
          <span>{friend.wdlTogether.loses}L</span>
        </div>
      </div>

      <div className={classes.invite}>
        <button
          className={classes["invite-button"]}
          onClick={() => {
            setSelectedFriend(friend);
          }}
        >
          Invite
        </button>
      </div>
    </div>
  );
}

export default FriendCard;
