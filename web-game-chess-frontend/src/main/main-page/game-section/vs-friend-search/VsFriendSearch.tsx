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
} from "../../../../shared/utils/types/gameModels";
import { CreatePrivateGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import TimeSelection from "./time-selection/TimeSelection";
import FriendList from "./friends-list/FriendList";

type VsFriendSearchProps = {};

function VsFriendSearch({}: VsFriendSearchProps) {
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[]>([]);
  const [selectedFriend, setSelectedFriend] =
    useState<GetAllFriendsByStatusDto | null>(null);

  const getFriends = async () => {
    try {
      const getFriendsModel: GetAllFriendsByStatusModel = {
        status: friendshipStatus.accepted,
        pageSize: 10,
        pageNumber: 1,
      };

      const friendsResponse = await axios.get<
        PagedResult<GetAllFriendsByStatusDto>
      >(
        friendshipControllerPaths.getAllFriendsByStatus(getFriendsModel),
        getAuthorization()
      );

      setFriends(friendsResponse.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  const onInviteFriendToGame = async (
    friendshipId: string,
    header: string,
    values: number[]
  ) => {
    try {
      const typeValue = timingTypes[header];

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

  useEffect(() => {
    getFriends();
  }, []);

  const handleCopyOnClick = async (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    try {
      const target = event.target as HTMLElement;
      const linkToCopy = target.innerText;

      await navigator.clipboard.writeText(linkToCopy);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.search__split}>
        <div className={classes.search__split__bar}>
          <h2>Invate to play</h2>

          <p className={classes.text}>Search among friends:</p>
          <input placeholder="username" />

          <p className={classes.sep}>or</p>
          <p className={classes.text}>Send this link to friend:</p>
          <p
            className={classes.link}
            onClick={(event) => {
              handleCopyOnClick(event);
            }}
          >
            https://some/link
            <span>copy</span>
          </p>
        </div>

        {selectedFriend ? (
          <TimeSelection
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            onInviteFriendToGame={onInviteFriendToGame}
          />
        ) : (
          <FriendList friends={friends} setSelectedFriend={setSelectedFriend} />
        )}
      </div>
    </div>
  );
}

export default VsFriendSearch;
