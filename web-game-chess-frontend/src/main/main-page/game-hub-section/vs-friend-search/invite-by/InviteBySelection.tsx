import { Guid } from "guid-typescript";
import classes from "./InviteBy.module.scss";
import { CreatePrivateGameModel, NotifyUserModel } from "../../../../../shared/utils/types/gameModels";
import { CreatePrivateGameDto } from "../../../../../shared/utils/types/gameDtos";
import axios from "axios";
import { gameController, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { useNavigate } from "react-router-dom";
import { useTimingType } from "../../../../../shared/utils/hooks/useTimingType";
import { ChangeEvent, Dispatch, ForwardedRef, forwardRef, SetStateAction, useImperativeHandle } from "react";
import { InviteBySelectionRef } from "../VsFriendSearchData";
import { delayAction } from "../../../../../shared/utils/functions/events";
import { TimingTypeModel } from "../../../../../shared/utils/types/abstractDtosAndModels";
import { getEnumValueByKey } from "../../../../../shared/utils/functions/enums";
import { TimingType } from "../../../../../shared/utils/objects/entitiesEnums";
import { TimingTypeName } from "../../../../../shared/utils/objects/constantLists";

type InviteBySelectionProps = {
  // to filter friend by username
  setSelectedUsername: Dispatch<SetStateAction<string>>;
};

const InviteBySelection = forwardRef<InviteBySelectionRef, InviteBySelectionProps>(
  ({ setSelectedUsername }: InviteBySelectionProps, ref: ForwardedRef<InviteBySelectionRef>) => {
    ///

    const navigate = useNavigate();
    const { showPopup } = usePopup();
    const { setTimingType } = useTimingType();

    // to invite friend to game via selection from friend list
    const onInviteBySelection = async (
      friendshipId: Guid,
      header: TimingTypeName,
      values: [number, number]
    ): Promise<void> => {
      try {
        const typeValue: TimingType = getEnumValueByKey(TimingType, header.toLowerCase());

        const gameType: TimingTypeModel = {
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
          gameController.createPrivateGame(),
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

        await GameHubService.NotifyUser(notifyModel);

        showPopup("User invited", "success");
        navigate(`await/${privateGameResponse.data.gameId}`);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    useImperativeHandle(ref, () => ({
      onInviteBySelection,
    }));
    //*/

    // to filter users by names
    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const username = target.value.toLocaleLowerCase();

      setSelectedUsername(username);
    };
    //*/

    return (
      <div className={classes.invite}>
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
      </div>
    );
  }
);

export default InviteBySelection;
