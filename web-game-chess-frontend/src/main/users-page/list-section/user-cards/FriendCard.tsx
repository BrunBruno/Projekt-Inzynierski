import axios from "axios";
import { FriendshipStatus } from "../../../../shared/utils/objects/entitiesEnums";
import { GetAllFriendsByStatusDto, GetFriendProfileDto } from "../../../../shared/utils/types/friendshipDtos";
import { RespondToFriendRequestModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import { friendshipController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";

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
        showPopup("User accepted", "success");
      } else {
        showPopup("User blocked", "error");
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
        showPopup("Friend removed", "error");
      } else {
        showPopup("Friend unblocked", "success");
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
          <div className={classes.actions}>
            <button
              data-testid="users-page-friend-card-profile-button"
              className={classes["main-button"]}
              onClick={() => {
                onShowProfile();
              }}
            >
              See Profile
            </button>
            <button
              data-testid="users-page-friend-card-remove-button"
              className={classes["sec-button"]}
              onClick={() => {
                onRemoveFriend(true);
              }}
            >
              Remove
            </button>
          </div>
        );

      case FriendshipStatus.pending:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.actions}>
                <button
                  data-testid="users-page-friend-card-accept-button"
                  className={classes["main-button"]}
                  onClick={() => {
                    onRespondToRequest(true);
                  }}
                >
                  Accept
                </button>
                <button
                  data-testid="users-page-friend-card-decline-button"
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRespondToRequest(false);
                  }}
                >
                  Decline
                </button>
              </div>
            ) : (
              <div className={classes.info}>Request pending ...</div>
            )}
          </>
        );

      case FriendshipStatus.rejected:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.actions}>
                <button
                  data-testid="users-page-friend-card-unblock-button"
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRemoveFriend(false);
                  }}
                >
                  Unblock
                </button>
              </div>
            ) : (
              <div className={classes.info}>User blocked you</div>
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
          {generateButtons()}
        </div>

        <div className={classes.card__content__country}>
          <img src={`https://flagsapi.com/${friend.country}/flat/64.png`} />
        </div>
      </div>
    </div>
  );
}

export default FriendCard;
