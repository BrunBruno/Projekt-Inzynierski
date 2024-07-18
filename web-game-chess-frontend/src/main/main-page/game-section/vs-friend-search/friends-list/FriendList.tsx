import { useRef } from "react";
import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import LoadingPage from "../../../../../shared/components/loading-page/LoadingPage";

type FriendListProps = {
  friends: GetAllFriendsByStatusDto[] | null;
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

  if (!friends) {
    return <LoadingPage text="Loading data" />;
  }

  return (
    <div
      ref={scrollRef}
      className={classes.list}
      onWheel={() => {
        handleListOnScroll();
      }}
    >
      {friends.length > 0 ? (
        friends.map((friend) => (
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
              <div className={classes.elo}>
                <span>
                  <TimingTypesIcons
                    iconClass={classes.icon}
                    iconName="bullet"
                    color={mainColor.c0}
                  />
                  {friend.elo.bullet}
                </span>
                <span>
                  <TimingTypesIcons
                    iconClass={classes.icon}
                    iconName="blitz"
                    color={mainColor.c0}
                  />
                  {friend.elo.blitz}
                </span>
                <span>
                  <TimingTypesIcons
                    iconClass={classes.icon}
                    iconName="rapid"
                    color={mainColor.c0}
                  />
                  {friend.elo.rapid}
                </span>
                <span>
                  <TimingTypesIcons
                    iconClass={classes.icon}
                    iconName="classic"
                    color={mainColor.c0}
                  />
                  {friend.elo.classic}
                </span>
                <span>
                  <TimingTypesIcons
                    iconClass={classes.icon}
                    iconName="daily"
                    color={mainColor.c0}
                  />
                  {friend.elo.daily}
                </span>
              </div>
              <div className={classes["previous-games"]}>
                <p>{friend.gamesPlayed} games played </p>
                <span>{friend.wins}W</span> <span>{friend.draws}D</span>{" "}
                <span>{friend.loses}L</span>
              </div>
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
        ))
      ) : (
        <div className={classes.empty}>
          {Array.from({ length: 8 }).map((_) => (
            <div className={classes["empty-card"]}>
              <AvatarSvg iconClass={classes["blank-avatar"]} />
              <div className={classes.texts}>
                <p />
                <p />{" "}
              </div>
            </div>
          ))}

          <div className={classes["no-data"]}>No results. </div>
        </div>
      )}
    </div>
  );
}

export default FriendList;
