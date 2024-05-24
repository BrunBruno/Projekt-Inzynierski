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

  const [users, setUsers] = useState<GetAllNonFriendsDto[]>([]);
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);

  const getAllUsers = async () => {
    try {
      if (selectedList === friendshipStatus.all) {
        const getAllNonFriendsModel: GetAllNonFriendsModel = {
          username: selectedUsername,
          pageNumber: 1,
          pageSize: 100,
        };

        const friendsResponse = await axios.get<
          PagedResult<GetAllNonFriendsDto>
        >(
          friendshipControllerPaths.getAllNonFriends(getAllNonFriendsModel),
          getAuthorization()
        );

        setFriends([]);
        setUsers(friendsResponse.data.items);
      } else {
        const getAllFriendsByStatus: GetAllFriendsByStatusModel = {
          pageNumber: 1,
          pageSize: 100,
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
        <div className={classes.list__grid}>
          {users.map((user, i) => (
            <UserCards key={i} user={user} onInviteFriend={onInviteFriend} />
          ))}
        </div>
      ) : (
        <div className={classes.list__grid}>
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
