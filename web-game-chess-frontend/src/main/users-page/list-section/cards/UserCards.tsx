import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { GetAllNonFriendsDto } from "../../../../shared/utils/types/friendshipDtos";
import classes from "./Cards.module.scss";

type UserCardsProps = {
  user: GetAllNonFriendsDto;
  onInviteFriend: (userId: string) => Promise<void>;
};

function UserCards({ user, onInviteFriend }: UserCardsProps) {
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
              className={classes["main-button"]}
              onClick={() => {
                onInviteFriend(user.userId);
              }}
            >
              Add to friends
            </button>
            <button className={classes["sec-button"]} onClick={() => {}}>
              See Profile
            </button>
          </div>
        </div>
      </div>
      <div className={classes.content}></div>
    </div>
  );
}

export default UserCards;
