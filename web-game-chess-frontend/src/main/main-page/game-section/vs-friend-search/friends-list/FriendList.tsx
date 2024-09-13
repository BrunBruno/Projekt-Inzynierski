import { useEffect, useState } from "react";
import AvatarIcon from "../../../../../shared/svgs/icons/AvatarIcon";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";
import usePagination from "../../../../../shared/utils/hooks/usePagination";
import { GetAllFriendsByStatusModel } from "../../../../../shared/utils/types/friendshipModels";
import { friendshipControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import axios from "axios";
import { FriendshipStatus } from "../../../../../shared/utils/enums/entitiesEnums";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../../../shared/utils/types/abstractDtosAndModels";
import FriendCard from "./friend-card/FriendCard";

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
              <AvatarIcon iconClass={classes["blank-avatar"]} />
              <div className={classes.texts}>
                <p className={classes["blank-text"]} />
                <p className={classes["blank-text"]} />
              </div>
            </div>
          ))}

          <div className={classes["no-data"]}>No results. </div>
        </div>
      ) : (
        // friends list
        friends.map((friend) => <FriendCard friend={friend} setSelectedFriend={setSelectedFriend} />)
      )}

      {/* count indicator */}
      {friends && friends.length > 0 && (
        <div className={classes.list__indicator}>
          {friends.length} / {totalItemsCount}
        </div>
      )}
    </div>
  );
}

export default FriendList;
