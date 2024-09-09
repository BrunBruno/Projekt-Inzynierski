import { useEffect, useState } from "react";
import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import usePagination from "../../../../../shared/utils/hooks/usePagination";
import { GetAllFriendsByStatusModel } from "../../../../../shared/utils/types/friendshipModels";
import { friendshipControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import axios from "axios";
import { FriendshipStatus } from "../../../../../shared/utils/enums/entitiesEnums";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../../../shared/utils/types/abstractDtosAndModels";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../../../shared/svgs/TimingTypesIcons";

type FriendListProps = {
  // username provided in input to filter
  selectedUsername: string;
  // to select user on "invite" button click
  setSelectedFriend: React.Dispatch<React.SetStateAction<GetAllFriendsByStatusDto | null>>;
};

function FriendList({ selectedUsername, setSelectedFriend }: FriendListProps) {
  ///

  const { showPopup } = usePopup();
  const { scrollRef, pageSize, pageNumber, totalItemsCount, setTotalItemsCount, setDefPageSize } = usePagination();

  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[] | null>(null);

  useEffect(() => {
    setDefPageSize(10);
  }, []);

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
          getAuthorization(),
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

  // set default page size based on list to elements size ratio
  // add resize handler to update default size
  useEffect(() => {
    const setDefSize = () => {
      const container = scrollRef.current;
      const itemsPerRow = window.innerWidth < 1100 && window.innerWidth > 500 ? 2 : 1;

      if (container) {
        const containerHeight = container.clientHeight;
        const firstChild = container.firstChild as HTMLElement;
        const elementHeight = firstChild.clientHeight;

        if (elementHeight > 0) {
          const count = Math.ceil(containerHeight / elementHeight) * itemsPerRow;

          setDefPageSize(count);
        }
      }
    };

    setDefSize();
    window.addEventListener("resize", setDefSize);

    return () => {
      window.removeEventListener("resize", setDefSize);
    };
  }, [friends]);
  //*/

  return (
    <div ref={scrollRef} className={classes.list}>
      {friends === null || friends.length === 0 ? (
        // empty result
        <div className={classes.list__empty}>
          {Array.from({ length: pageSize }).map((_, i) => (
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
      ) : (
        // friends list
        friends.map((friend) => (
          <div key={friend.friendshipId.toString()} className={classes.list__element}>
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
                  <IconCreator
                    icons={timingTypesIcons}
                    iconClass={classes.icon}
                    iconName="bullet"
                    color={mainColor.c0}
                  />
                  <span>{friend.elo.bullet}</span>
                </span>

                <span>
                  <IconCreator
                    icons={timingTypesIcons}
                    iconClass={classes.icon}
                    iconName="blitz"
                    color={mainColor.c0}
                  />
                  <span>{friend.elo.blitz}</span>
                </span>

                <span>
                  <IconCreator
                    icons={timingTypesIcons}
                    iconClass={classes.icon}
                    iconName="rapid"
                    color={mainColor.c0}
                  />
                  <span>{friend.elo.rapid}</span>
                </span>

                <span>
                  <IconCreator
                    icons={timingTypesIcons}
                    iconClass={classes.icon}
                    iconName="classic"
                    color={mainColor.c0}
                  />
                  <span>{friend.elo.classic}</span>
                </span>

                <span>
                  <IconCreator
                    icons={timingTypesIcons}
                    iconClass={classes.icon}
                    iconName="daily"
                    color={mainColor.c0}
                  />
                  <span>{friend.elo.daily}</span>
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
      )}

      {/* count indicator */}
      {friends && (
        <div className={classes.list__indicator}>
          {friends.length} / {totalItemsCount}
        </div>
      )}
    </div>
  );
}

export default FriendList;
