import { useEffect, useState } from "react";
import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import LoadingPage from "../../../../../shared/components/loading-page/LoadingPage";
import usePagination from "../../../../../shared/utils/hooks/usePagination";
import { GetAllFriendsByStatusModel } from "../../../../../shared/utils/types/friendshipModels";
import { friendshipControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import axios from "axios";
import { FriendshipStatus } from "../../../../../shared/utils/enums/entitiesEnums";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../../../shared/utils/types/abstracDtosAndModels";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";

type FriendListProps = {
  // usernam provided in input to filter
  selectedUsername: string;
  // to select user on "invite" button click
  setSelectedFriend: React.Dispatch<React.SetStateAction<GetAllFriendsByStatusDto | null>>;
};

function FriendList({ selectedUsername, setSelectedFriend }: FriendListProps) {
  ///

  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[] | null>(null);

  const { showPopup } = usePopup();

  const { scrollRef, pageSize, pageNumber, totalItemsCount, setTotalItemsCount, setDefPageSize } = usePagination();

  useEffect(() => {
    setDefPageSize(10);
  });

  // get all friends to display for invitations

  useEffect(() => {
    const getFriends = async () => {
      try {
        const model: GetAllFriendsByStatusModel = {
          username: selectedUsername,
          status: FriendshipStatus.accepted,
          pageSize: pageSize,
          pageNumber: pageNumber,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipControllerPaths.getAllFriendsByStatus(model),
          getAuthorization()
        );

        setFriends(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getFriends();
  }, [selectedUsername, pageSize]);
  //*/

  if (!friends) return <LoadingPage text="Loading data" />;

  return (
    <div ref={scrollRef} className={classes.list}>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.freindshpId.toString()} className={classes.list__element}>
            <AvatarImage
              username={friend.username}
              imageUrl={friend.imageUrl}
              containerClass={classes.avatar}
              imageClass={classes["user-avatar"]}
            />

            <div className={classes.data}>
              <h3>{friend.username}</h3>

              <div className={classes.elo}>
                <span>
                  <TimingTypesIcons iconClass={classes.icon} iconName="bullet" color={mainColor.c0} />
                  {friend.elo.bullet}
                </span>
                <span>
                  <TimingTypesIcons iconClass={classes.icon} iconName="blitz" color={mainColor.c0} />
                  {friend.elo.blitz}
                </span>
                <span>
                  <TimingTypesIcons iconClass={classes.icon} iconName="rapid" color={mainColor.c0} />
                  {friend.elo.rapid}
                </span>
                <span>
                  <TimingTypesIcons iconClass={classes.icon} iconName="classic" color={mainColor.c0} />
                  {friend.elo.classic}
                </span>
                <span>
                  <TimingTypesIcons iconClass={classes.icon} iconName="daily" color={mainColor.c0} />
                  {friend.elo.daily}
                </span>
              </div>

              <div className={classes["previous-games"]}>
                <p>You played {friend.wdlTogether.total} games together </p>
                <span>{friend.wdlTogether.wins}W</span>
                {" - "}
                <span>{friend.wdlTogether.draws}D</span>
                {" - "}
                <span>{friend.wdlTogether.loses}L</span>
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={classes["empty-card"]}>
              <AvatarSvg iconClass={classes["blank-avatar"]} />
              <div className={classes.texts}>
                <p />
                <p />
              </div>
            </div>
          ))}

          <div className={classes["no-data"]}>No results. </div>
        </div>
      )}

      <div className={classes.list__indicator}>
        {friends.length} / {totalItemsCount}
      </div>
    </div>
  );
}

export default FriendList;
