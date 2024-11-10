import axios from "axios";
import { FriendshipStatus } from "../../../../shared/utils/objects/entitiesEnums";
import { GetAllFriendsByStatusDto, GetFriendProfileDto } from "../../../../shared/utils/types/friendshipDtos";
import { RespondToFriendRequestModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import { friendshipController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { userPageIcons } from "../../UsersPageIcons";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";

type FriendCardsProps = {
  // selected list type
  selectedList: number;
  // user/friend dto
  friend: GetAllFriendsByStatusDto;
  // to update users
  getAllUsers: () => Promise<void>;
  // to select profile to show
  setFriend: (friend: GetFriendProfileDto) => void;
};

function FriendCard({ selectedList, friend, getAllUsers, setFriend }: FriendCardsProps) {
  ///

  const { showPopup } = usePopup();

  // response to friendship request
  const onRespondToRequest = async (accept: boolean): Promise<void> => {
    try {
      const model: RespondToFriendRequestModel = {
        friendshipId: friend.friendshipId,
        isAccepted: accept,
      };

      await axios.put(friendshipController.respondToFriendRequest(friend.friendshipId), model, getAuthorization());

      if (accept === true) {
        showPopup("USER ACCEPTED", "success");
      } else {
        showPopup("USER BLOCKED", "error");
      }

      getAllUsers();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // delete friend /  remove friendship
  // used to unblock blocked friends
  const onRemoveFriend = async (action: boolean): Promise<void> => {
    try {
      await axios.delete(friendshipController.removeFriend(friend.friendshipId), getAuthorization());

      if (action === true) {
        showPopup("FRIEND REMOVED", "error");
      } else {
        showPopup("FRIEND UNBLOCKED", "success");
      }

      getAllUsers();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // get friend data to display in profile
  const onShowProfile = async (): Promise<void> => {
    try {
      const response = await axios.get<GetFriendProfileDto>(
        friendshipController.getFriendProfile(friend.friendshipId),
        getAuthorization()
      );

      setFriend(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // return correct button based on selected list
  const generateButtons = (): JSX.Element => {
    switch (selectedList) {
      case FriendshipStatus.accepted:
        return (
          <div className={classes.card__actions}>
            <button
              data-testid="users-page-friend-card-profile-button"
              className={classes["main-button"]}
              onClick={() => {
                onShowProfile();
              }}
            >
              <IconCreator
                icons={userPageIcons}
                iconName={"profile"}
                iconClass={classes["button-icon"]}
                color={mainColor.c0}
              />
              <span>See Profile</span>
            </button>

            <button
              data-testid="users-page-friend-card-remove-button"
              className={classes["sec-button"]}
              onClick={() => {
                onRemoveFriend(true);
              }}
            >
              <IconCreator
                icons={userPageIcons}
                iconName={"decline"}
                iconClass={classes["button-icon"]}
                color={mainColor.c9}
              />
              <span>Remove friend</span>
            </button>
          </div>
        );

      case FriendshipStatus.pending:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.card__actions}>
                <button
                  data-testid="users-page-friend-card-accept-button"
                  className={classes["main-button"]}
                  onClick={() => {
                    onRespondToRequest(true);
                  }}
                >
                  <IconCreator
                    icons={userPageIcons}
                    iconName={"love"}
                    iconClass={classes["button-icon"]}
                    color={mainColor.c0}
                  />
                  <span>Accept</span>
                </button>

                <button
                  data-testid="users-page-friend-card-decline-button"
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRespondToRequest(false);
                  }}
                >
                  <IconCreator
                    icons={userPageIcons}
                    iconName={"decline"}
                    iconClass={classes["button-icon"]}
                    color={mainColor.c9}
                  />
                  <span>Decline</span>
                </button>
              </div>
            ) : (
              <div className={classes.card__actions}>
                <div className={classes["action-info"]}>Request pending ...</div>

                <button
                  data-testid="users-page-friend-card-unblock-button"
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRemoveFriend(false);
                  }}
                >
                  <IconCreator
                    icons={userPageIcons}
                    iconName={"decline"}
                    iconClass={classes["button-icon"]}
                    color={mainColor.c9}
                  />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </>
        );

      case FriendshipStatus.rejected:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.card__actions}>
                <button
                  data-testid="users-page-friend-card-unblock-button"
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRemoveFriend(false);
                  }}
                >
                  <IconCreator
                    icons={userPageIcons}
                    iconName={"love"}
                    iconClass={classes["button-icon"]}
                    color={mainColor.c9}
                  />
                  <span>Unblock</span>
                </button>
              </div>
            ) : (
              <div className={classes.card__actions}>
                <div className={classes["action-info"]}>User blocked you</div>
              </div>
            )}
          </>
        );
      default:
        return <></>;
    }
  };
  //*/

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <AvatarImage
          username={friend.username}
          profilePicture={friend.profilePicture}
          containerClass={classes.card__content__avatar}
          imageClass={classes["avatar-img"]}
        />

        <div className={classes.card__content__info}>
          <div className={classes["user-name"]}>
            <p>{friend.username}</p>
            <p>{friend.name ? friend.name : "----- -----"}</p>
          </div>

          <div className={classes.country}>
            <div className={classes.image}>
              <img src={`https://flagsapi.com/${friend.country}/flat/64.png`} />
            </div>
            <span>{friend.country}</span>
          </div>
        </div>
      </div>

      {generateButtons()}
    </div>
  );
}

export default FriendCard;
