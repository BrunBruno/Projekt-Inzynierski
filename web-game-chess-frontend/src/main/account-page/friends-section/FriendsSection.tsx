import { useEffect, useState } from "react";
import classes from "./FriendsSection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import axios from "axios";
import { PagedResult } from "../../../shared/utils/types/commonTypes";
import {
  friendshipControllerPaths,
  getAuthorization,
} from "../../../shared/utils/functions/apiFunctions";
import { GetAllFriendsByStatusModel } from "../../../shared/utils/types/friendshipModels";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import AvatarSvg from "../../../shared/svgs/AvatarSvg";

function FriendsSection() {
  const [friendList, setFriendList] = useState<
    GetAllFriendsByStatusDto[] | null
  >(null);

  const [selectedFriend, setSelectedFriend] = useState<HTMLElement | null>(
    null
  );

  const getFriends = async () => {
    try {
      const frindsModel: GetAllFriendsByStatusModel = {
        username: "",
        status: friendshipStatus.accepted,
        pageNumber: 1,
        pageSize: 100,
      };

      const friendsResponse = await axios.get<
        PagedResult<GetAllFriendsByStatusDto>
      >(
        friendshipControllerPaths.getAllFriendsByStatus(frindsModel),
        getAuthorization()
      );

      setFriendList(friendsResponse.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const setActive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLElement;

    setSelectedFriend(target);

    clearSelection();

    target.classList.add(classes.active);
  };

  const clearSelection = () => {
    if (selectedFriend !== null)
      selectedFriend.classList.remove(classes.active);
  };

  if (!friendList) return <LoadingPage text="Loading data" />;

  return (
    <div
      className={classes.friends}
      onMouseLeave={() => {
        clearSelection();
      }}
    >
      {friendList.map((friend) => (
        <div
          key={friend.freindshpId}
          className={classes.friends__friend}
          onMouseEnter={(event) => {
            setActive(event);
          }}
        >
          <div className={classes.friends__friend__content}>
            <div className={classes.friends__friend__content__avatar}>
              {friend.imageUrl === null ? (
                <AvatarSvg iconClass={""} />
              ) : (
                <img src={friend.imageUrl} />
              )}

              <div className={classes["country"]}>
                {" "}
                <img
                  src={`https://flagsapi.com/${friend.country}/flat/64.png`}
                />
              </div>
            </div>
            <div className={classes.friends__friend__content__name}>
              <span>{friend.username}</span>{" "}
              <span>{friend.name === null ? "---" : friend.name}</span>
            </div>
            <div className={classes.friends__friend__content__data}>
              <span>{friend.wins}</span>
              {" | "}
              <span>{friend.draws}</span>
              {" | "}
              <span>{friend.loses}</span>
            </div>{" "}
          </div>

          <div className={classes.friends__friend__actions}>
            <button>Profile</button>
            <button>Play</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendsSection;
