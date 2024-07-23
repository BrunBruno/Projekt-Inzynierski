import axios from "axios";
import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { GetAllNonFriendsDto } from "../../../../shared/utils/types/friendshipDtos";
import { InviteFriendModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import {
  friendshipControllerPaths,
  getAuthorization,
  userControllerPaths,
} from "../../../../shared/utils/functions/apiFunctions";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GetOtherUserDto } from "../../../../shared/utils/types/userDtos";
import { GetOtherUserModel } from "../../../../shared/utils/types/userModels";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";

type UserCardsProps = {
  // user data to create card
  user: GetAllNonFriendsDto;
  // to updated list when action was performed
  getAllUsers: () => Promise<void>;
  // to select profile to show
  setNonFriend: (user: GetOtherUserDto) => void;
};

function UserCards({ user, getAllUsers, setNonFriend }: UserCardsProps) {
  ///

  const { showPopup } = usePopup();

  // invite new friend
  const onInviteFriend = async (userId: string) => {
    try {
      const model: InviteFriendModel = {
        receiverId: userId,
      };

      await axios.post(friendshipControllerPaths.inviteFriend(), model, getAuthorization());

      showPopup("Invitation sent", "success");

      getAllUsers();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get non friend profile to display
  const onShowProfile = async () => {
    try {
      const model: GetOtherUserModel = {
        userId: user.userId,
      };

      const response = await axios.get<GetOtherUserDto>(userControllerPaths.getOtherUser(model), getAuthorization());

      setNonFriend(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <div className={classes.card__content__avatar}>
          {user.imageUrl === null ? (
            <AvatarSvg iconClass={classes["avatar-svg"]} />
          ) : (
            <img src={user.imageUrl} alt={user.username} className={classes["avatar-img"]} />
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
            <button
              className={classes["sec-button"]}
              onClick={() => {
                onShowProfile();
              }}
            >
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
