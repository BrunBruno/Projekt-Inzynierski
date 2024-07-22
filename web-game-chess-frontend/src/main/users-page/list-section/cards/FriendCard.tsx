import axios from "axios";
import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { friendshipStatus } from "../../../../shared/utils/enums/entitiesEnums";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import { RespondToFriendRequestModel } from "../../../../shared/utils/types/friendshipModels";
import classes from "./Cards.module.scss";
import {
  friendshipControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";

type FriendCardsProps = {
  // selected list type
  selectedList: number;
  // user/friend dto
  friend: GetAllFriendsByStatusDto;
  // to update users
  getAllUsers: () => Promise<void>;
};

function FriendCard({ selectedList, friend, getAllUsers }: FriendCardsProps) {
  ///

  const { showPopup } = usePopup();

  // response to friendshi request
  const onRespondToRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const respondModel: RespondToFriendRequestModel = {
        friendshipId: friendshipId,
        isAccepted: accept,
      };

      await axios.put(
        friendshipControllerPaths.respondToFriendRequest(),
        respondModel,
        getAuthorization()
      );

      getAllUsers();
    } catch (err) {
      console.log(err);
      showPopup("Connection error", "warning");
    }
  };

  // delete friend /  remove freindship
  const onRemoveFriend = async (friendshipId: string) => {
    try {
      await axios.delete(
        friendshipControllerPaths.removeFriend(friendshipId),
        getAuthorization()
      );

      showPopup("Friend removed", "error");

      getAllUsers();
    } catch (err) {
      console.log(err);
      showPopup("Connection error", "warning");
    }
  };

  // return correct button based on selected list
  const generateButtons = (): JSX.Element => {
    switch (selectedList) {
      case friendshipStatus.accepted:
        return (
          <div className={classes.actions}>
            <button className={classes["main-button"]} onClick={() => {}}>
              See Profile
            </button>
            <button
              className={classes["sec-button"]}
              onClick={() => {
                onRemoveFriend(friend.freindshpId);
              }}
            >
              Remove
            </button>
          </div>
        );
      case friendshipStatus.pending:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.actions}>
                <button
                  className={classes["main-button"]}
                  onClick={() => {
                    onRespondToRequest(friend.freindshpId, true);
                  }}
                >
                  Accept
                </button>
                <button
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRespondToRequest(friend.freindshpId, false);
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
      case friendshipStatus.rejected:
        return (
          <>
            {!friend.isRequestor ? (
              <div className={classes.actions}>
                <button
                  className={classes["sec-button"]}
                  onClick={() => {
                    onRemoveFriend(friend.freindshpId);
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

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <div className={classes.card__content__avatar}>
          {friend.imageUrl === null ? (
            <AvatarSvg iconClass={classes["avatar-svg"]} />
          ) : (
            <img
              src={friend.imageUrl}
              alt={friend.username}
              className={classes["avatar-img"]}
            />
          )}
        </div>

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
