import axios from "axios";
import { GetAllFriendsByStatusModel, GetAllNonFriendsModel } from "../../../shared/utils/types/friendshipModels";
import classes from "./ListSection.module.scss";
import { PagedResult } from "../../../shared/utils/types/commonTypes";
import {
  GetAllFriendsByStatusDto,
  GetAllNonFriendsDto,
  GetFriendProfileDto,
} from "../../../shared/utils/types/friendshipDtos";
import { friendshipControllerPaths, getAuthorization } from "../../../shared/utils/functions/apiFunctions";
import { useEffect, useRef, useState } from "react";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import UserCards from "./cards/UserCards";
import FriendCard from "./cards/FriendCard";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { GetOtherUserDto } from "../../../shared/utils/types/userDtos";
import { getErrMessage } from "../../../shared/utils/functions/displayError";

type ListSectionProps = {
  // provided username to match
  selectedUsername: string;
  // type of user/freind list to get
  selectedList: number;
  // set non friend data for profile
  setUserProfile: React.Dispatch<React.SetStateAction<GetOtherUserDto | null>>;
  // set  friend data for profile
  setFriendProfile: React.Dispatch<React.SetStateAction<GetFriendProfileDto | null>>;
};

function ListSection({ selectedUsername, selectedList, setUserProfile, setFriendProfile }: ListSectionProps) {
  ///

  const listRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<GetAllNonFriendsDto[]>([]);
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);

  const { scrollRef, pageNumber, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  const { showPopup } = usePopup();

  // get all friends and non friends for user based on choice
  const getAllUsers = async () => {
    try {
      // fetch for all other users
      if (selectedList === friendshipStatus.all) {
        const model: GetAllNonFriendsModel = {
          username: selectedUsername,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllNonFriendsDto>>(
          friendshipControllerPaths.getAllNonFriends(model),
          getAuthorization()
        );

        setFriends([]);
        setUsers(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);

        // fetch for user with relationship establshied
      } else {
        const model: GetAllFriendsByStatusModel = {
          username: selectedUsername,
          pageNumber: pageNumber,
          pageSize: pageSize,
          status: selectedList,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipControllerPaths.getAllFriendsByStatus(model),
          getAuthorization()
        );

        setUsers([]);
        setFriends(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get users, according to selecttion
  useEffect(() => {
    getAllUsers();
  }, [selectedUsername, selectedList, pageSize, pageNumber]);

  // set empty list class
  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      if (users.length === 0 && friends.length === 0) {
        listElement.classList.add(classes["empty-list"]);
      } else {
        listElement.classList.remove(classes["empty-list"]);
      }
    }
  }, [users, friends, listRef]);

  // set default page size based on list to elemts size ratio
  // add resize handler to update default size
  useEffect(() => {
    const setDefSize = () => {
      const container = scrollRef.current;
      if (container) {
        const containerHeight = container.clientHeight;
        const firstChild = container.firstChild as HTMLElement;
        const elementHeight = firstChild.clientHeight;

        if (elementHeight > 0) {
          const count = Math.ceil(containerHeight / elementHeight) * 2;

          setDefPageSize(count);
        }
      }
    };

    setDefSize();
    window.addEventListener("resize", setDefSize);

    return () => {
      window.removeEventListener("resize", setDefSize);
    };
  }, [users, friends, listRef]);

  // setter for profile data
  const setNonFriend = (user: GetOtherUserDto) => {
    setFriendProfile(null);
    setUserProfile(user);
  };
  const setFriend = (friend: GetFriendProfileDto) => {
    setUserProfile(null);
    setFriendProfile(friend);
  };

  // to display loading on scroll
  const handleLoading = (event: React.WheelEvent<HTMLDivElement>) => {
    const loadingElement = loadingRef.current;
    const scrollingElement = scrollRef.current;

    if (loadingElement && scrollingElement) {
      const isScrollingDown = event.deltaY > 0;
      const isAtBottom =
        scrollingElement.scrollHeight - 1.01 * scrollingElement.scrollTop <= scrollingElement.clientHeight;

      if (isScrollingDown && isAtBottom) {
        loadingElement.classList.add(classes.active);

        setTimeout(() => {
          loadingElement.classList.remove(classes.active);
        }, 1000);
      }
    }
  };

  return (
    <section ref={listRef} className={classes.list}>
      <div className={classes["bg-corner"]} />
      <div className={classes["bg-corner"]} />

      <div ref={loadingRef} className={classes.list__loading}>
        <LoadingPage />
      </div>

      {users.length > 0 ? (
        <div
          ref={scrollRef}
          className={classes.list__grid}
          onWheel={(event) => {
            handleLoading(event);
          }}
        >
          {users.map((user, i) => (
            <UserCards
              key={`user-card-${user.username}-${i}`}
              user={user}
              getAllUsers={getAllUsers}
              setNonFriend={setNonFriend}
            />
          ))}
        </div>
      ) : friends.length > 0 ? (
        <div
          ref={scrollRef}
          className={classes.list__grid}
          onWheel={(event) => {
            handleLoading(event);
          }}
        >
          {friends.map((friend, i) => (
            <FriendCard
              key={`friend-card-${friend.username}-${i}`}
              selectedList={selectedList}
              friend={friend}
              getAllUsers={getAllUsers}
              setFriend={setFriend}
            />
          ))}
        </div>
      ) : (
        <div className={classes["empty-search"]}>
          <span>No users</span>
          <span>found</span>
        </div>
      )}

      <div className={classes.list__indicatior}>
        {users.length > 0 && (
          <p>
            {users.length} / {totalItemsCount}
          </p>
        )}
        {friends.length > 0 && (
          <p>
            {friends.length} / {totalItemsCount}
          </p>
        )}
      </div>
    </section>
  );
}

export default ListSection;
