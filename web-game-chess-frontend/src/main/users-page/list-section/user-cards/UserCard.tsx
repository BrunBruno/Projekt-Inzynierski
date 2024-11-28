import axios from "axios";
import { GetAllNonFriendsDto } from "../../../../shared/utils/types/friendshipDtos";
import { BlockUserModel, InviteFriendModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import { friendshipController, getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GetOtherUserDto } from "../../../../shared/utils/types/userDtos";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import { userPageIcons } from "../../UsersPageIcons";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { GetAllUsersFunc, SetNonFriendFunc } from "../../UsersPageData";

type UserCardProps = {
  // user data to create card
  user: GetAllNonFriendsDto;
  // to updated list when action was performed
  getAllUsers: GetAllUsersFunc;
  // to select profile to show
  setNonFriend: SetNonFriendFunc;
};

function UserCard({ user, getAllUsers, setNonFriend }: UserCardProps) {
  ///

  const { showPopup } = usePopup();

  // invite new friend
  const onInviteFriend = async (userId: Guid): Promise<void> => {
    try {
      const model: InviteFriendModel = {
        receiverId: userId,
      };

      await axios.post(friendshipController.inviteFriend(), model, getAuthorization());

      showPopup("INVITATION SENT", "success");

      getAllUsers();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get non friend profile to display
  const onShowProfile = async (): Promise<void> => {
    try {
      const response = await axios.get<GetOtherUserDto>(userController.getOtherUser(user.userId), getAuthorization());

      setNonFriend(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // delete friend /  remove friendship
  // used to unblock blocked friends
  const onBlockUser = async (): Promise<void> => {
    const model: BlockUserModel = {
      userId: user.userId,
    };

    try {
      await axios.post(friendshipController.blockUser(), model, getAuthorization());
      showPopup("USER BLOCKED", "error");

      getAllUsers();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <AvatarImage
          username={user.username}
          profilePicture={user.profilePicture}
          containerClass={classes.card__content__avatar}
          imageClass={classes["avatar-img"]}
        />

        <div className={classes.card__content__info}>
          <div className={classes["user-name"]}>
            <p>{user.username}</p>
            <p>{user.name ? user.name : "----- -----"}</p>
          </div>

          <div className={classes.country}>
            <div className={classes.image}>
              <img src={`https://flagsapi.com/${user.country}/flat/64.png`} />
            </div>
            <span>{user.country}</span>
          </div>
        </div>
      </div>

      <div className={classes.card__actions}>
        <button
          data-testid="users-page-user-card-invite-button"
          className={classes["main-button"]}
          onClick={() => {
            onInviteFriend(user.userId);
          }}
        >
          <IconCreator icons={userPageIcons} iconName={"add"} iconClass={classes["button-icon"]} color={mainColor.c0} />
          <span>Add to friends</span>
        </button>

        <button
          data-testid="users-page-user-card-profile-button"
          className={classes["sec-button"]}
          onClick={() => {
            onShowProfile();
          }}
        >
          <IconCreator
            icons={userPageIcons}
            iconName={"profile"}
            iconClass={classes["button-icon"]}
            color={mainColor.c9}
          />
          <span>See profile</span>
        </button>

        <button
          data-testid="users-page-user-card-profile-button"
          className={classes["sec-button"]}
          onClick={() => {
            onBlockUser();
          }}
        >
          <IconCreator
            icons={userPageIcons}
            iconName={"decline"}
            iconClass={classes["button-icon"]}
            color={mainColor.c9}
          />
          <span>Block user</span>
        </button>
      </div>
    </div>
  );
}

export default UserCard;
