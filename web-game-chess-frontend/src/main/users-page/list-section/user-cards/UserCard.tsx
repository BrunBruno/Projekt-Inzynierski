import axios from "axios";
import { GetAllNonFriendsDto } from "../../../../shared/utils/types/friendshipDtos";
import { InviteFriendModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import {
  friendshipControllerPaths,
  getAuthorization,
  userControllerPaths,
} from "../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GetOtherUserDto } from "../../../../shared/utils/types/userDtos";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";

type UserCardProps = {
  // user data to create card
  user: GetAllNonFriendsDto;
  // to updated list when action was performed
  getAllUsers: () => Promise<void>;
  // to select profile to show
  setNonFriend: (user: GetOtherUserDto) => void;
};

function UserCard({ user, getAllUsers, setNonFriend }: UserCardProps) {
  ///

  const { showPopup } = usePopup();

  // invite new friend
  const onInviteFriend = async (userId: Guid) => {
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
  //*/

  // get non friend profile to display
  const onShowProfile = async () => {
    try {
      const response = await axios.get<GetOtherUserDto>(
        userControllerPaths.getOtherUser(user.userId),
        getAuthorization()
      );

      setNonFriend(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <AvatarImage
          username={user.username}
          imageUrl={user.imageUrl}
          containerClass={classes.card__content__avatar}
          imageClass={classes["avatar-img"]}
        />

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

export default UserCard;
