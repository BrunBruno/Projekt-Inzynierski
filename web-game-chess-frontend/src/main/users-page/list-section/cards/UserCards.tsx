import axios from "axios";
import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { GetAllNonFriendsDto } from "../../../../shared/utils/types/friendshipDtos";
import { InviteFriendModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import {
  friendshipControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";

type UserCardsProps = {
  user: GetAllNonFriendsDto;
  getAllUsers: () => Promise<void>;
};

function UserCards({ user, getAllUsers }: UserCardsProps) {
  ///

  const { showPopup } = usePopup();

  // invite new friend
  const onInviteFriend = async (userId: string) => {
    try {
      const model: InviteFriendModel = {
        receiverId: userId,
      };

      await axios.post(
        friendshipControllerPaths.inviteFriend(),
        model,
        getAuthorization()
      );

      showPopup("Invitation sent", "success");

      getAllUsers();
    } catch (err) {
      console.log(err);
      showPopup("Connection error", "warning");
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <div className={classes.card__content__avatar}>
          {user.imageUrl === null ? (
            <AvatarSvg iconClass={classes["avatar-svg"]} />
          ) : (
            <img
              src={user.imageUrl}
              alt={user.username}
              className={classes["avatar-img"]}
            />
          )}
        </div>

        <div className={classes.card__content__info}>
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

        <div className={classes.card__content__country}>
          <img src={`https://flagsapi.com/${user.country}/flat/64.png`} />
        </div>
      </div>
    </div>
  );
}

export default UserCards;
