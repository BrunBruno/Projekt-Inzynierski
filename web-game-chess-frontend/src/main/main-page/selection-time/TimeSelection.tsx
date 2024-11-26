import axios from "axios";
import classes from "./TimeSelection.module.scss";
import { webGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import {
  CreatePrivateGameByEmailDto,
  CreatePrivateGameDto,
  CreatePrivateGameWithLinkDto,
  SearchWebGameDto,
} from "../../../shared/utils/types/webGameDtos";
import GameHubService from "../../../shared/utils/services/GameHubService";
import {
  CreatePrivateGameByEmailModel,
  CreatePrivateGameModel,
  CreatePrivateGameWithLinkModel,
  NotifyUserModel,
  SearchWebGameModel,
} from "../../../shared/utils/types/webGameModels";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { displayFromLowercase, getEnumValueByKey } from "../../../shared/utils/functions/enums";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../shared/utils/objects/constantLists";
import { TimingType } from "../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction, useState } from "react";
import { defaultTimeControls, TimeControl } from "../../../shared/utils/objects/gameTimingMaps";
import { PrivateGameOptions } from "../MainPageData";
import { mainPageIcons } from "../MainPageIcons";
import { Guid } from "guid-typescript";

type NN = [number, number];

type TimeSelectionProps = {
  // to set online game ids
  setOnlineGameIds?: Dispatch<SetStateAction<SearchWebGameDto | null>>;
  //
  privateGameOptions?: PrivateGameOptions | null;
  //
  setGameUrl?: Dispatch<SetStateAction<string>>;
  // to invite to private game
  setPrivateGameIds?: Dispatch<
    SetStateAction<CreatePrivateGameDto | CreatePrivateGameByEmailDto | CreatePrivateGameWithLinkDto | null>
  >;
};

function TimeSelection({ setOnlineGameIds, privateGameOptions, setGameUrl, setPrivateGameIds }: TimeSelectionProps) {
  ///

  const { showPopup } = usePopup();

  const [inactiveControls, setInactiveControls] = useState<boolean>(false);

  // to search for online game
  const onSearchForOnlineGame = async (header: TimingTypeName, values: [number, number]): Promise<void> => {
    if (setOnlineGameIds === undefined) return;

    const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: SearchWebGameModel = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<SearchWebGameDto>(webGameController.startSearch(), model, getAuthorization());

      setOnlineGameIds(response.data);

      // update players queue
      await GameHubService.PlayerJoined(response.data.timingId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to invite friend to game via selection from friend list
  const onInviteBySelection = async (friendshipId: Guid, header: TimingTypeName, values: NN): Promise<void> => {
    if (!setPrivateGameIds) return;

    const typeValue: TimingType = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: CreatePrivateGameModel = {
      friendshipId: friendshipId,
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<CreatePrivateGameDto>(
        webGameController.createPrivateGame(),
        model,
        getAuthorization()
      );

      const notifyModel: NotifyUserModel = {
        friendId: response.data.friendId,
        gameId: response.data.gameId,
        inviter: response.data.inviter,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      await GameHubService.NotifyUser(notifyModel);

      showPopup("USER INVITED", "success");

      setPrivateGameIds(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to invite friend to game by providing user email
  const onInviteByEmail = async (email: string, header: TimingTypeName, values: NN): Promise<void> => {
    if (!setPrivateGameIds) return;

    const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: CreatePrivateGameByEmailModel = {
      email: email,
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<CreatePrivateGameByEmailDto>(
        webGameController.createGameByEmail(),
        model,
        getAuthorization()
      );

      const notifyModel: NotifyUserModel = {
        friendId: response.data.friendId,
        gameId: response.data.gameId,
        inviter: response.data.inviter,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      await GameHubService.NotifyUser(notifyModel);

      showPopup("USER INVITED", "success");

      setPrivateGameIds(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // invite to game by url
  const onInviteByUrl = async (header: string, values: NN): Promise<void> => {
    if (!setPrivateGameIds || !setGameUrl) return;

    const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: CreatePrivateGameWithLinkModel = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<CreatePrivateGameWithLinkDto>(
        webGameController.createGameWithLink(),
        model,
        getAuthorization()
      );

      showPopup("GAME CREATED", "success");

      setGameUrl(response.data.gameUrl);
      setPrivateGameIds(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to start private games
  const onStartPrivateGame = (header: TimingTypeName, values: [number, number]): void => {
    if (!privateGameOptions) return;

    if (privateGameOptions.selectedFriend) {
      onInviteBySelection(privateGameOptions.selectedFriend.friendshipId, header, values);
    }

    if (privateGameOptions.selectedUser) {
      onInviteByEmail(privateGameOptions.selectedUser.email, header, values);
    }

    if (privateGameOptions.selectedByUrl) {
      onInviteByUrl(header, values);
    }
  };

  // apply correct action after control selection
  const onControlSelected = (header: TimingTypeName, values: [number, number]): void => {
    setInactiveControls(true);

    if (setOnlineGameIds) onSearchForOnlineGame(header, values);
    if (setPrivateGameIds) onStartPrivateGame(header, values);
  };

  // display time controls buttons
  const transformTag = (tag: string): JSX.Element => {
    const transformedTag: JSX.Element[] = [];

    for (let i = 0; i < tag.length; i++) {
      const char: string = tag[i];
      if (char === "|") {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.sep}>
            {char}
          </p>
        );
      } else if (!isNaN(parseInt(char))) {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.num}>
            {char}
          </p>
        );
      } else {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.char}>
            {char}
          </p>
        );
      }
    }

    return <div className={classes["timing-tag"]}>{transformedTag}</div>;
  };

  // to show header based on current searching
  const displaySectionHeader = (): JSX.Element => {
    if (setOnlineGameIds)
      return (
        <h2 className={classes["section-header"]}>
          <IconCreator icons={mainPageIcons} iconName={"vsPlayer"} iconClass={classes["time-selection-icon"]} />
          <span>Online Search</span>
        </h2>
      );

    if (setPrivateGameIds)
      return (
        <h2 className={classes["section-header"]}>
          <IconCreator icons={mainPageIcons} iconName={"vsFriend"} iconClass={classes["time-selection-icon"]} />
          <span>Private Game</span>
        </h2>
      );

    return <></>;
  };

  return (
    <div
      data-testid="main-page-vs-player-section"
      className={`${classes.search} ${inactiveControls ? classes.inactive : ""}`}
    >
      <div className={classes.search__grid}>
        <div className={classes.search__grid__header}>{displaySectionHeader()}</div>

        {/* map game timing types */}
        {defaultTimeControls.map((control: TimeControl, index: number) => (
          <div key={`row-${index}`} className={classes.search__grid__row}>
            {/* row header */}
            <div className={classes["timing-header"]}>
              <IconCreator
                icons={timingTypeIcons}
                iconName={control.header.toLocaleLowerCase() as TimingTypeName}
                iconClass={classes["header-icon"]}
                color={mainColor.c5}
              />
              <span>{displayFromLowercase(control.header)}</span>
            </div>

            {/* options */}
            {control.tags.map((tag: string, i: number) => (
              <div
                key={`time-control-${index}-${i}`}
                data-testid={`main-page-vs-player-time-control-${index}-${i}`}
                className={classes["time-control"]}
                onClick={() => {
                  onControlSelected(control.header, control.values[i]);
                }}
              >
                {transformTag(tag)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeSelection;
