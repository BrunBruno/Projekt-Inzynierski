import { useRef } from "react";
import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";

type FriendListProps = {
  friends: GetAllFriendsByStatusDto[];
  setSelectedFriend: React.Dispatch<
    React.SetStateAction<GetAllFriendsByStatusDto | null>
  >;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalItemsCount: number;
};

function FriendList({
  friends,
  setSelectedFriend,
  pageSize,
  setPageSize,
  totalItemsCount,
}: FriendListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleListOnScroll = () => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      if (
        scrollingElement.scrollHeight - 1.1 * scrollingElement.scrollTop <=
        scrollingElement.clientHeight
      ) {
        if (pageSize < totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + 6);
        }
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className={classes.list}
      onWheel={() => {
        handleListOnScroll();
      }}
    >
      {friends.map((friend) => (
        <div key={friend.freindshpId} className={classes.list__element}>
          <div className={classes.avatar}>
            {friend.imageUrl ? (
              <img
                className={classes["user-avatar"]}
                src={friend.imageUrl}
                alt={`${friend.username}`}
              />
            ) : (
              <AvatarSvg iconClass={classes["user-avatar"]} />
            )}
          </div>
          <div className={classes.data}>
            <h3>{friend.username}</h3>
            <p className={classes.elo}>{/* (<span>{friend.elo}</span>) */}</p>
            <p className={classes["previous-games"]}>
              <span>10W</span> <span>1D</span> <span>9L</span>
            </p>
          </div>
          <div className={classes.invite}>
            <button
              onClick={() => {
                setSelectedFriend(friend);
              }}
            >
              Invite
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendList;
