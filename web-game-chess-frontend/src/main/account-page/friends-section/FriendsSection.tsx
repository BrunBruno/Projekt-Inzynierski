import { useEffect, useState } from "react";
import classes from "./FriendsSection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import axios from "axios";
import { friendshipControllerPaths, getAuthorization } from "../../../shared/utils/services/ApiService";
import { GetAllFriendsByStatusModel } from "../../../shared/utils/types/friendshipModels";
import { FriendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import FriendCard from "./friend-card/FriendCard";
import cardClasses from "./friend-card/FriendCard.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import FriendEmptyCard from "./friend-empty-card/FriendEmptyCard";

function FriendsSection() {
  ///

  const [friendList, setFriendList] = useState<GetAllFriendsByStatusDto[] | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<HTMLElement | null>(null);

  const { showPopup } = usePopup();
  const { scrollRef, totalItemsCount, setTotalItemsCount } = usePagination();

  // to get friend list
  useEffect(() => {
    const getFriends = async () => {
      try {
        const model: GetAllFriendsByStatusModel = {
          username: "",
          status: FriendshipStatus.accepted,
          pageNumber: 1,
          pageSize: 100,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipControllerPaths.getAllFriendsByStatus(model),
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
  const clearSelection = () => {
    if (selectedFriend !== null) selectedFriend.classList.remove(cardClasses.active);
  };
  //*/

  if (!friendList) return <LoadingPage text="Loading data" />;

  return (
    <div
      ref={scrollRef}
      className={classes.friends}
      onMouseLeave={() => {
        clearSelection();
      }}
    >
      {friendList.length > 0 ? (
        friendList.map((friend) => (
          <FriendCard
            key={friend.friendshipId.toString()}
            friend={friend}
            setSelectedFriend={setSelectedFriend}
            clearSelection={clearSelection}
          />
        ))
      ) : (
        <FriendEmptyCard />
      )}

      {friendList.length > 0 && (
        <div className={classes.friends__indicator}>
          {friendList.length} of {totalItemsCount}
        </div>
      )}
    </div>
  );
}

export default FriendsSection;
