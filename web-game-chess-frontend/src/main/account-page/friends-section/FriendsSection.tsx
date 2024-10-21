import { useEffect, useRef, useState } from "react";
import classes from "./FriendsSection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import axios from "axios";
import { friendshipController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { GetAllFriendsByStatusModel } from "../../../shared/utils/types/friendshipModels";
import { FriendshipStatus } from "../../../shared/utils/objects/entitiesEnums";
import FriendCard from "./friend-card/FriendCard";
import cardClasses from "./friend-card/FriendCard.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import FriendEmptyCard from "./friend-empty-card/FriendEmptyCard";

function FriendsSection() {
  ///

  const { showPopup } = usePopup();
  const { scrollRef, pageNumber, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  const firstEmptyCardRef = useRef<HTMLDivElement>(null);

  // list of friends state
  const [friendList, setFriendList] = useState<GetAllFriendsByStatusDto[] | null>(null);
  // to activate friend card
  const [selectedFriend, setSelectedFriend] = useState<HTMLElement | null>(null);

  // set default page size based on list to elements size ratio
  // add resize handler to update default size
  useEffect(() => {
    const setDefSize = (): void => {
      const container = scrollRef.current;
      const itemsPerRow = 4;

      if (container) {
        const containerHeight = container.clientHeight;
        let firstChild = container.firstChild as HTMLDivElement;
        if (firstChild && firstChild.classList.contains(classes["empty-cards"])) {
          firstChild = firstEmptyCardRef.current as HTMLDivElement;
        }
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
  }, [friendList]);
  //*/

  // to get friend list
  useEffect(() => {
    const getFriends = async (): Promise<void> => {
      try {
        const model: GetAllFriendsByStatusModel = {
          username: "",
          status: FriendshipStatus.accepted,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };

        const response = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipController.getAllFriendsByStatus(model),
          getAuthorization()
        );

        setFriendList(response.data.items);
        setTotalItemsCount(response.data.totalItemsCount);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getFriends();
  }, [pageNumber, pageSize]);
  //*/

  // to deactivate friend selection
  const clearSelection = (): void => {
    if (selectedFriend) selectedFriend.classList.remove(cardClasses.active);
  };
  //*/

  return (
    <div
      ref={scrollRef}
      data-testid="account-page-friends-section"
      className={`
        ${classes.friends} 
        ${!friendList || friendList.length === 0 ? classes.template : ""}
      `}
      onMouseLeave={() => {
        clearSelection();
      }}
    >
      {friendList && friendList.length > 0 ? (
        friendList.map((friend: GetAllFriendsByStatusDto, i: number) => (
          <FriendCard
            key={`friendship-${i}-${friend.friendshipId.toString()}`}
            friend={friend}
            setSelectedFriend={setSelectedFriend}
            clearSelection={clearSelection}
          />
        ))
      ) : (
        <div className={classes["empty-cards"]}>
          <FriendEmptyCard isLoaded={friendList !== null} firstEmptyCardRef={firstEmptyCardRef} />
        </div>
      )}

      {friendList && friendList.length > 0 && (
        <div className={classes.friends__indicator}>
          {friendList.length} of {totalItemsCount}
        </div>
      )}
    </div>
  );
}

export default FriendsSection;
