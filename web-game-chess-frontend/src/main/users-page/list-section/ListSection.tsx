import axios from "axios";
import {
  GetAllFriendsByStatusModel,
  GetAllNonFriendsModel,
  InviteFriendModel,
  RespondToFriendRequestModel,
} from "../../../shared/utils/types/friendshipModels";
import classes from "./ListSection.module.scss";
import { PagedResult } from "../../../shared/utils/types/commonTypes";
import {
  GetAllFriendsByStatusDto,
  GetAllNonFriendsDto,
} from "../../../shared/utils/types/friendshipDtos";
import {
  friendshipControllerPaths,
  getAuthorization,
} from "../../../shared/utils/functions/apiFunctions";
import { useEffect, useRef, useState } from "react";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import UserCards from "./cards/UserCards";
import FriendCard from "./cards/FriendCard";

type ListSectionProps = {
  selectedUsername: string;
  selectedList: number;
};

function ListSection({ selectedUsername, selectedList }: ListSectionProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<GetAllNonFriendsDto[]>([]);
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);

  const [pageSize, setPageSize] = useState<number>(100);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  const getAllUsers = async () => {
    try {
      if (selectedList === friendshipStatus.all) {
        const getAllNonFriendsModel: GetAllNonFriendsModel = {
          username: selectedUsername,
          pageNumber: 1,
          pageSize: pageSize,
        };

        const friendsResponse = await axios.get<
          PagedResult<GetAllNonFriendsDto>
        >(
          friendshipControllerPaths.getAllNonFriends(getAllNonFriendsModel),
          getAuthorization()
        );

        setFriends([]);
        setUsers(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);
      } else {
        const getAllFriendsByStatus: GetAllFriendsByStatusModel = {
          username: selectedUsername,
          pageNumber: 1,
          pageSize: pageSize,
          status: selectedList,
        };

        const friendsResponse = await axios.get<
          PagedResult<GetAllFriendsByStatusDto>
        >(
          friendshipControllerPaths.getAllFriendsByStatus(
            getAllFriendsByStatus
          ),
          getAuthorization()
        );

        setUsers([]);
        setFriends(friendsResponse.data.items);
        setTotalItemsCount(friendsResponse.data.totalItemsCount);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [selectedUsername, selectedList]);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      if (users.length === 0 && friends.length === 0) {
        listElement.classList.add(classes["empty-list"]);
      } else {
        listElement.classList.remove(classes["empty-list"]);
      }
    }
  }, [users, listRef]);

  const onInviteFriend = async (userId: string) => {
    try {
      const inviteFriendModel: InviteFriendModel = {
        receiverId: userId,
      };

      await axios.post(
        friendshipControllerPaths.inviteFriend(),
        inviteFriendModel,
        getAuthorization()
      );

      getAllUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const onRespondToRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const respondModel: RespondToFriendRequestModel = {
        friendshipId: friendshipId,
        isAccepted: accept,
      };

      await axios.put(
        friendshipControllerPaths.respondToFriendRequest(),
        respondModel,
        getAuthorization()
      );

      getAllUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const onRemoveFriend = async (friendshipId: string) => {
    try {
      await axios.delete(
        friendshipControllerPaths.removeFriend(friendshipId),
        getAuthorization()
      );

      getAllUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleListOnScroll = () => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      if (
        scrollingElement.scrollHeight - 1.1 * scrollingElement.scrollTop <=
        scrollingElement.clientHeight
      ) {
        if (pageSize < totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + 6);
        }
      }
    }
  };

  return (
    <section ref={listRef} className={classes.list}>
      <div className={classes["bg-corner"]} />
      <div className={classes["bg-corner"]} />
      {users.length === 0 && friends.length === 0 ? (
        <div className={classes["empty-search"]}>
          <span>No users</span>
          <span>found</span>
        </div>
      ) : users.length > 0 ? (
        <div
          ref={scrollRef}
          className={classes.list__grid}
          onWheel={() => {
            handleListOnScroll();
          }}
        >
          {users.map((user, i) => (
            <UserCards key={i} user={user} onInviteFriend={onInviteFriend} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className={classes.list__grid}
          onWheel={() => {
            handleListOnScroll();
          }}
        >
          {friends.map((friend, i) => (
            <FriendCard
              key={i}
              selectedList={selectedList}
              friend={friend}
              onRespondToRequest={onRespondToRequest}
              onRemoveFriend={onRemoveFriend}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListSection;
