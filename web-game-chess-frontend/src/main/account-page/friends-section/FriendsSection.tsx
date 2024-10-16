import { useEffect, useState } from "react";
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
  const { scrollRef, totalItemsCount, setTotalItemsCount } = usePagination();

  // list of friends state
  const [friendList, setFriendList] = useState<GetAllFriendsByStatusDto[] | null>(null);
  // to activate friend card
  const [selectedFriend, setSelectedFriend] = useState<HTMLElement | null>(null);

  // to get friend list
  useEffect(() => {
    const getFriends = async (): Promise<void> => {
      try {
        const model: GetAllFriendsByStatusModel = {
          username: "",
          status: FriendshipStatus.accepted,
          pageNumber: 1,
          pageSize: 100,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipController.getAllFriendsByStatus(model),
          getAuthorization()
        );

        setFriendList(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getFriends();
  }, []);
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
        <FriendEmptyCard isLoaded={friendList !== null} />
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
