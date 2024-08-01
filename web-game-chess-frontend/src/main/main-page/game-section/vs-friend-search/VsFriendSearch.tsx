import { useState } from "react";
import classes from "./VsFriendSearch.module.scss";
import { timingTypes } from "../../../../shared/utils/enums/entitiesEnums";
import axios from "axios";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import {
  gameControllerPaths,
  getAuthorization,
  userControllerPaths,
} from "../../../../shared/utils/services/ApiService";
import {
  CreateGameByEmailModel,
  CreatePrivateGameModel,
  NotifyUserModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import { CreateGameByEmailDto, CreatePrivateGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import TimeSelection from "./time-selection/TimeSelection";
import FriendList from "./friends-list/FriendList";
import { delayAction } from "../../../../shared/utils/functions/eventsRelated";
import RoundArrowSvg from "../../../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../../../shared/utils/enums/colorMaps";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import { GetByEmailModel } from "../../../../shared/utils/types/userModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { Guid } from "guid-typescript";
import { useTimingType } from "../../../../shared/utils/hooks/useTimingType";

type VsFriendSearchProps = {
  // to set selected timing
};

function VsFriendSearch({}: VsFriendSearchProps) {
  ///

  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<GetAllFriendsByStatusDto | null>(null);

  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<GetByEmailDto | null>(null);

  const { showPopup } = usePopup();

  const { setTimingType } = useTimingType();

  // to inviate friend to game via selection from friend list
  const onInviteFriendToGame = async (friendshipId: Guid, header: string, values: number[]) => {
    try {
      const typeValue = timingTypes[header.toLowerCase()];

      const gameType: SearchGameModel = {
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      setTimingType(gameType);

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

      showPopup("User invited", "success");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to invite friend to game by providing user emial
  const onInviteByEmail = async (email: string, header: string, values: number[]) => {
    try {
      const typeValue = timingTypes[header.toLowerCase()];

      const gameType: SearchGameModel = {
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      setTimingType(gameType);

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

      showPopup("User invited", "success");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to filter users by names
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();
    setSelectedUsername(username);
  };

  // to set email address
  const setEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const email = target.value.toLocaleLowerCase();
    setSelectedEmail(email);
  };

  // to get user data by provide emial
  const getByEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedEmail)) {
      setSelectedEmail("");
      return;
    }

    const getByEmailModel: GetByEmailModel = {
      email: selectedEmail,
    };

    try {
      const userResponse = await axios.get<GetByEmailDto>(
        userControllerPaths.getByEmail(getByEmailModel),
        getAuthorization()
      );

      setSelectedUser(userResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
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
              className={classes["input-search"]}
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
              className={classes["input-mail"]}
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
              <RoundArrowSvg color={mainColor.c9} secColor={mainColor.c0} iconClass={classes["arrow-svg"]} />
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
          <FriendList selectedUsername={selectedUsername} setSelectedFriend={setSelectedFriend} />
        )}
      </div>
    </div>
  );
}

export default VsFriendSearch;
