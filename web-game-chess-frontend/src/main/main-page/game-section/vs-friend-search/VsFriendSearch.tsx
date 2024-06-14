import { useEffect, useState } from "react";
import classes from "./VsFriendSearch.module.scss";
import { GetAllFriendsByStatusModel } from "../../../../shared/utils/types/friendshipModels";
import {
  friendshipStatus,
  timingTypes,
} from "../../../../shared/utils/enums/entitiesEnums";
import axios from "axios";
import { PagedResult } from "../../../../shared/utils/types/commonTypes";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import {
  friendshipControllerPaths,
  gameControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import {
  CreatePrivateGameModel,
  NotifyUserModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import { CreatePrivateGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import TimeSelection from "./time-selection/TimeSelection";
import FriendList from "./friends-list/FriendList";
import { delayAction } from "../../../../shared/utils/functions/eventsRelated";

type VsFriendSearchProps = {
  setChoosenTiming: React.Dispatch<
    React.SetStateAction<SearchGameModel | null>
  >;
};

function VsFriendSearch({ setChoosenTiming }: VsFriendSearchProps) {
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const [
    selectedFriend,
    setSelectedFriend,
  ] = useState<GetAllFriendsByStatusDto | null>(null);

  const getFriends = async () => {
    try {
      const getFriendsModel: GetAllFriendsByStatusModel = {
        username: selectedUsername,
        status: friendshipStatus.accepted,
        pageSize: pageSize,
        pageNumber: 1,
      };

      console.log(selectedUsername);

      const friendsResponse = await axios.get<
        PagedResult<GetAllFriendsByStatusDto>
      >(
        friendshipControllerPaths.getAllFriendsByStatus(getFriendsModel),
        getAuthorization()
      );

      setFriends(friendsResponse.data.items);
      setTotalItemsCount(friendsResponse.data.totalItemsCount);

      console.log(friendsResponse.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFriends();
  }, [selectedUsername, pageSize]);

  const onInviteFriendToGame = async (
    friendshipId: string,
    header: string,
    values: number[]
  ) => {
    try {
      const typeValue = timingTypes[header];

      const gameType: SearchGameModel = {
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      setChoosenTiming(gameType);

      const privateGameModel: CreatePrivateGameModel = {
        friendshipId: friendshipId,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      const privateGameResponse = await axios.post<CreatePrivateGameDto>(
        gameControllerPaths.createPrivateGame(),
        privateGameModel,
        getAuthorization()
      );

      const notifyModel: NotifyUserModel = {
        friendId: privateGameResponse.data.friendId,
        gameId: privateGameResponse.data.gameId,
        inviter: privateGameResponse.data.inviter,
      };

      GameHubService.NotifyUser(notifyModel);
    } catch (err) {
      console.log(err);
    }
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();
    setSelectedUsername(username);
  };

  return (
    <div className={classes.search}>
      <div className={classes.search__split}>
        <div className={classes.search__split__bar}>
          <h2>Invate to play</h2>

          <p className={classes.text}>Search among friends:</p>
          <input
            placeholder="username"
            onChange={(event) => {
              delayAction(() => {
                onSearch(event);
              }, 200);
            }}
          />
        </div>

        {selectedFriend ? (
          <TimeSelection
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            onInviteFriendToGame={onInviteFriendToGame}
          />
        ) : (
          <FriendList
            friends={friends}
            setSelectedFriend={setSelectedFriend}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalItemsCount={totalItemsCount}
          />
        )}
      </div>
    </div>
  );
}

export default VsFriendSearch;
