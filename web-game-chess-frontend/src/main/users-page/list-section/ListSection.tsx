import axios from "axios";
import { GetAllFriendsByStatusModel, GetAllNonFriendsModel } from "../../../shared/utils/types/friendshipModels";
import classes from "./ListSection.module.scss";
import {
  GetAllFriendsByStatusDto,
  GetAllNonFriendsDto,
  GetFriendProfileDto,
} from "../../../shared/utils/types/friendshipDtos";
import { friendshipController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { Dispatch, SetStateAction, useEffect, useRef, useState, WheelEvent } from "react";
import { FriendshipStatus } from "../../../shared/utils/objects/entitiesEnums";
import UserCard from "./user-cards/UserCard";
import FriendCard from "./user-cards/FriendCard";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { GetOtherUserDto } from "../../../shared/utils/types/userDtos";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { mainColor } from "../../../shared/utils/objects/colorMaps";

type ListSectionProps = {
  // provided username to match
  selectedUsername: string;
  // type of user/friend list to get
  selectedList: number;
  // set non friend data for profile
  setUserProfile: Dispatch<SetStateAction<GetOtherUserDto | null>>;
  // set  friend data for profile
  setFriendProfile: Dispatch<SetStateAction<GetFriendProfileDto | null>>;
};

function ListSection({ selectedUsername, selectedList, setUserProfile, setFriendProfile }: ListSectionProps) {
  ///

  const { scrollRef, pageNumber, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();
  const { showPopup } = usePopup();

  // user list ref
  const listRef = useRef<HTMLDivElement>(null);
  // loading list animation ref
  const loadingRef = useRef<HTMLDivElement>(null);

  // users that are friends to current user or not
  const [users, setUsers] = useState<GetAllNonFriendsDto[]>([]);
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);

  // get users, according to selection
  // get all friends and non friends for user based on choice
  const getAllUsers = async (): Promise<void> => {
    try {
      // fetch for all other users
      if (selectedList === FriendshipStatus.all) {
        const model: GetAllNonFriendsModel = {
          username: selectedUsername,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };

        const response = await axios.get<PagedResult<GetAllNonFriendsDto>>(
          friendshipController.getAllNonFriends(model),
          getAuthorization()
        );

        setFriends([]);
        setUsers(response.data.items);
        setTotalItemsCount(response.data.totalItemsCount);

        // fetch for user with relationship established
      } else {
        const model: GetAllFriendsByStatusModel = {
          username: selectedUsername,
          pageNumber: pageNumber,
          pageSize: pageSize,
          status: selectedList,
        };

        const friendsResponse = await axios.get<PagedResult<GetAllFriendsByStatusDto>>(
          friendshipController.getAllFriendsByStatus(model),
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

  // set default page size based on list to elements size ratio
  // add resize handler to update default size
  useEffect(() => {
    const getItemsPerRow = (): number => {
      const wh = window.innerWidth;
      if (wh < 500) {
        return 2;
      } else if (wh < 1800) {
        return 3;
      } else if (wh < 3200) {
        return 4;
      } else {
        return 5;
      }
    };

    const setDefSize = (): void => {
      const container = scrollRef.current;
      const itemsPerRow = getItemsPerRow();

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
  }, [users, friends]);

  // setter for profile data
  const setNonFriend = (user: GetOtherUserDto): void => {
    setFriendProfile(null);
    setUserProfile(user);
  };

  const setFriend = (friend: GetFriendProfileDto): void => {
    setUserProfile(null);
    setFriendProfile(friend);
  };

  // to display loading on scroll
  useEffect(() => {
    const handleLoading = (event: WheelEvent): void => {
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

    const scrollElement = scrollRef.current as HTMLDivElement;

    if (scrollElement) {
      // Convert to `unknown` first, then cast to `EventListener`
      scrollElement.addEventListener("wheel", handleLoading as unknown as EventListener, { passive: true });
    }

    // Cleanup event listener
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("wheel", handleLoading as unknown as EventListener);
      }
    };
  }, [scrollRef]);

  return (
    <section ref={listRef} className={classes.list}>
      <div className={classes["bg-corner"]} />
      <div className={classes["bg-corner"]} />

      <div ref={loadingRef} className={classes.list__loading}>
        <LoadingPage />
      </div>

      {/* users map */}
      {users.length > 0 ? (
        <div ref={scrollRef} data-testid="users-page-all-user-list" className={classes.list__grid}>
          {users.map((user: GetAllNonFriendsDto, i: number) => (
            <UserCard
              key={`user-card-${user.username}-${i}`}
              user={user}
              getAllUsers={getAllUsers}
              setNonFriend={setNonFriend}
            />
          ))}
        </div>
      ) : friends.length > 0 ? (
        <div ref={scrollRef} data-testid="users-page-friends-list" className={classes.list__grid}>
          {friends.map((friend: GetAllFriendsByStatusDto, i: number) => (
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
          <IconCreator
            icons={symbolIcons}
            iconName={"error"}
            iconClass={classes["no-data-icon"]}
            color={mainColor.c9}
          />
          <span>No users found</span>
        </div>
      )}
      {/* --- */}

      {/* indicator */}
      <div className={classes.list__indicator}>
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
