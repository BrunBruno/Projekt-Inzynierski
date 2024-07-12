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
  userControllerPaths,
} from "../../../../shared/utils/functions/apiFunctions";
import {
  CreateGameByEmailModel,
  CreatePrivateGameModel,
  NotifyUserModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import {
  CreateGameByEmailDto,
  CreatePrivateGameDto,
} from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import TimeSelection from "./time-selection/TimeSelection";
import FriendList from "./friends-list/FriendList";
import { delayAction } from "../../../../shared/utils/functions/eventsRelated";
import RoundArrowSvg from "../../../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../../../shared/utils/enums/colorMaps";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import { CheckIfEmailExistsModel } from "../../../../shared/utils/types/userModels";

type VsFriendSearchProps = {
  setChoosenTiming: React.Dispatch<
    React.SetStateAction<SearchGameModel | null>
  >;
};

function VsFriendSearch({ setChoosenTiming }: VsFriendSearchProps) {
  const [friends, setFriends] = useState<GetAllFriendsByStatusDto[] | null>(
    null
  );
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const [
    selectedFriend,
    setSelectedFriend,
  ] = useState<GetAllFriendsByStatusDto | null>(null);
  const [selectedUser, setSelectedUser] = useState<GetByEmailDto | null>(null);

  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const getFriends = async () => {
    try {
      const getFriendsModel: GetAllFriendsByStatusModel = {
        username: selectedUsername,
        status: friendshipStatus.accepted,
        pageSize: pageSize,
        pageNumber: 1,
      };

      const friendsResponse = await axios.get<
        PagedResult<GetAllFriendsByStatusDto>
      >(
        friendshipControllerPaths.getAllFriendsByStatus(getFriendsModel),
        getAuthorization()
      );

      setFriends(friendsResponse.data.items);
      setTotalItemsCount(friendsResponse.data.totalItemsCount);
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
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      GameHubService.NotifyUser(notifyModel);
    } catch (err) {
      console.log(err);
    }
  };

  const onInviteByEmail = async (
    email: string,
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

      const gameByEmailModel: CreateGameByEmailModel = {
        email: email,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      const privateGameResponse = await axios.post<CreateGameByEmailDto>(
        gameControllerPaths.createGameByEmail(),
        gameByEmailModel,
        getAuthorization()
      );

      const notifyModel: NotifyUserModel = {
        friendId: privateGameResponse.data.friendId,
        gameId: privateGameResponse.data.gameId,
        inviter: privateGameResponse.data.inviter,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
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

  const setEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const email = target.value.toLocaleLowerCase();
    setSelectedEmail(email);
  };

  const getByEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedEmail)) {
      setSelectedEmail("");
      return;
    }

    const getByEmailModel: CheckIfEmailExistsModel = {
      email: selectedEmail,
    };

    try {
      const userResponse = await axios.get<GetByEmailDto>(
        userControllerPaths.getByEmail(getByEmailModel),
        getAuthorization()
      );

      setSelectedUser(userResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.search__split}>
        <div className={classes.search__split__bar}>
          <h2>Invate to play</h2>

          <p className={classes.text}>Search among friends:</p>
          <div className={classes["input-holder"]}>
            <input
              placeholder="username"
              onChange={(event) => {
                delayAction(() => {
                  onSearch(event);
                }, 200);
              }}
            />
          </div>

          <p className={classes.text}>Invite using email:</p>
          <div className={classes["input-holder"]}>
            <input
              name="email"
              placeholder="email"
              value={selectedEmail}
              onChange={(event) => {
                setEmail(event);
              }}
            />

            <div
              className={classes["send-icon"]}
              onClick={() => {
                getByEmail();
              }}
            >
              <RoundArrowSvg
                color={mainColor.c9}
                secColor={mainColor.c0}
                iconClass={classes["arrow-svg"]}
              />
            </div>
          </div>

          {/* game by url */}
        </div>

        {selectedFriend || selectedUser ? (
          <TimeSelection
            selectedFriend={selectedFriend}
            selectedUser={selectedUser}
            setSelectedFriend={setSelectedFriend}
            setSelectedUser={setSelectedUser}
            onInviteFriendToGame={onInviteFriendToGame}
            onInviteByEmail={onInviteByEmail}
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
