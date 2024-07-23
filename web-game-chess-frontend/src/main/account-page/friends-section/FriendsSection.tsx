import { useEffect, useState } from "react";
import classes from "./FriendsSection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import axios from "axios";
import { PagedResult } from "../../../shared/utils/types/commonTypes";
import { friendshipControllerPaths, getAuthorization } from "../../../shared/utils/functions/apiFunctions";
import { GetAllFriendsByStatusModel } from "../../../shared/utils/types/friendshipModels";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import AvatarSvg from "../../../shared/svgs/AvatarSvg";
import FriendCard from "./friend-card/FriendCard";
import cardClasses from "./friend-card/FriendCard.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { getErrMessage } from "../../../shared/utils/functions/displayError";

function FriendsSection() {
  ///

  const [friendList, setFriendList] = useState<GetAllFriendsByStatusDto[] | null>(null);

  const [selectedFriend, setSelectedFriend] = useState<HTMLElement | null>(null);

  const { showPopup } = usePopup();

  const { scrollRef, totalItemsCount, setTotalItemsCount } = usePagination();

  const getFriends = async () => {
    try {
      const frindsModel: GetAllFriendsByStatusModel = {
        username: "",
        status: friendshipStatus.accepted,
        pageNumber: 1,
        pageSize: 100,
      };

      const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
        friendshipControllerPaths.getAllFriendsByStatus(frindsModel),
        getAuthorization()
      );

      setFriendList(friendsResponse.data.items);
      setTotalItemsCount(friendsResponse.data.totalItemsCount);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const clearSelection = () => {
    if (selectedFriend !== null) selectedFriend.classList.remove(cardClasses.active);
  };

  if (!friendList) return <LoadingPage text="Loading data" />;

  return (
    <div
      ref={scrollRef}
      className={`${classes.friends} ${friendList.length === 0 ? classes.tamplate : classes.duap}`}
      onMouseLeave={() => {
        clearSelection();
      }}
    >
      {friendList.length > 0 ? (
        friendList.map((friend) => (
          <FriendCard
            key={friend.freindshpId}
            friend={friend}
            setSelectedFriend={setSelectedFriend}
            clearSelection={clearSelection}
          />
        ))
      ) : (
        <>
          <div className={classes["no-data"]}>
            <span>You don't have any friends yet.</span>
          </div>
          {Array.from({ length: 16 }).map((_) => (
            <div className={classes["empty-card"]}>
              <AvatarSvg iconClass={classes["blank-avatar"]} />
              <p />
              <p />
            </div>
          ))}
        </>
      )}
      <div className={classes.friends__indicator}>
        {friendList.length} of {totalItemsCount}
      </div>
    </div>
  );
}

export default FriendsSection;
