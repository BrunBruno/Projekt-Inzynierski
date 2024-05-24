import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { friendshipStatus } from "../../../../shared/utils/enums/entitiesEnums";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import classes from "./Cards.module.scss";

type FriendCardsProps = {
  selectedList: number;
  friend: GetAllFriendsByStatusDto;
  onRespondToRequest: (friendshipId: string, accept: boolean) => Promise<void>;
  onRemoveFriend: (friendshipId: string) => Promise<void>;
};

function FriendCard({
  selectedList,
  friend,
  onRespondToRequest,
  onRemoveFriend,
}: FriendCardsProps) {
  switch (selectedList) {
    case friendshipStatus.accepted:
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
                  Remove friend
                </button>
              </div>
            </div>
          </div>
          <div className={classes.content}></div>
        </div>
      );

    case friendshipStatus.pending:
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
            </div>
          </div>
          <div className={classes.content}></div>
        </div>
      );

    case friendshipStatus.rejected:
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
            </div>
          </div>
          <div className={classes.content}></div>
        </div>
      );
  }
}

export default FriendCard;
