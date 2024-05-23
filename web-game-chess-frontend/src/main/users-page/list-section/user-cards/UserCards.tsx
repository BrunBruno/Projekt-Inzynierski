import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { friendshipStatus } from "../../../../shared/utils/enums/entitiesEnums";
import {
  GetAllFriendsByStatusDto,
  GetAllNonFriendsDto,
} from "../../../../shared/utils/types/friendshipDtos";
import classes from "./UserCards.module.scss";

type UserCardsProps = {
  selectedList: number;
  user: GetAllNonFriendsDto | null;
  friend: GetAllFriendsByStatusDto | null;
  onInviteFriend: (userId: string) => Promise<void>;
};

function UserCards({
  selectedList,
  user,
  friend,
  onInviteFriend,
}: UserCardsProps) {
  if (user !== null) {
    return (
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.avatar}>
            <AvatarSvg iconClass={classes["avatar-svg"]} />
          </div>
          <div className={classes["user-info"]}>
            <div className={classes["user-name"]}>
              <p>{user.username}</p>
              <p>{user.name ? user.name : "----- -----"}</p>
            </div>
            <div className={classes.actions}>
              <button
                className={classes.invite}
                onClick={() => {
                  onInviteFriend(user.userId);
                }}
              >
                Add to friends
              </button>
              <button className={classes.profile}>See Profile</button>
            </div>
          </div>
        </div>
        <div className={classes.content}></div>
      </div>
    );
  } else if (friend !== null) {
    if (selectedList === friendshipStatus.accepted) {
    } else {
      return (
        <div className={classes.card}>
          <div className={classes.header}>
            <div className={classes.avatar}>
              <AvatarSvg iconClass={classes["avatar-svg"]} />
            </div>
            <div className={classes["user-info"]}>
              <div className={classes["user-name"]}>
                <p>{friend.username}</p>
                <p>{friend.name ? friend.name : "----- -----"}</p>
              </div>
              <div className={classes.actions}></div>
            </div>
          </div>
          <div className={classes.content}></div>
        </div>
      );
    }
  }
}

export default UserCards;
