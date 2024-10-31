import axios from "axios";
import classes from "./TimeSelection.module.scss";
import { webGameController, getAuthorization, engineController } from "../../../../shared/utils/services/ApiService";
import { SearchWebGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { SearchWebGameModel } from "../../../../shared/utils/types/gameModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { displayFromLowercase, getEnumValueByKey } from "../../../../shared/utils/functions/enums";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction } from "react";
import { defaultTimeControls, TimeControl } from "../../../../shared/utils/objects/gameTimingMaps";
import { StartEngineGameDto } from "../../../../shared/utils/types/engineDtos";
import { StartEngineGameModel } from "../../../../shared/utils/types/engineModels";
import { gameHubSectionIcons } from "../GameHubSectionIcons";

type TimeSelectionProps = {
  // to set online game ids
  setOnlineGameIds?: Dispatch<SetStateAction<SearchWebGameDto | null>>;
  // to set offline game ids
  setOfflineGameIds?: Dispatch<SetStateAction<StartEngineGameDto | null>>;
  // to invite to private
  onInviteToPrivateGame?: (header: TimingTypeName, values: [number, number]) => void;
};

function TimeSelection({ setOnlineGameIds, setOfflineGameIds, onInviteToPrivateGame }: TimeSelectionProps) {
  ///

  const { showPopup } = usePopup();

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
  //*/

  // to start offline game
  const onStartOfflineGame = async (header: TimingTypeName, values: [number, number]): Promise<void> => {
    if (setOfflineGameIds === undefined) return;

    const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: StartEngineGameModel = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<StartEngineGameDto>(
        engineController.startEngineGame(),
        model,
        getAuthorization()
      );

      setOfflineGameIds(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  //
  const onStartPrivateGame = (header: TimingTypeName, values: [number, number]) => {
    if (onInviteToPrivateGame === undefined) return;

    onInviteToPrivateGame(header, values);
  };
  //*/

  const onControlSelected = (header: TimingTypeName, values: [number, number]): void => {
    if (setOnlineGameIds) onSearchForOnlineGame(header, values);

    if (setOfflineGameIds) onStartOfflineGame(header, values);

    if (onInviteToPrivateGame) onStartPrivateGame(header, values);
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
  //*/

  // to show header
  const displaySectionHeader = (): JSX.Element => {
    if (setOnlineGameIds)
      return (
        <h2 className={classes["section-header"]}>
          <IconCreator icons={gameHubSectionIcons} iconName={"vsPlayer"} iconClass={classes["time-selection-icon"]} />
          <span>Online Search</span>
        </h2>
      );

    if (setOfflineGameIds)
      return (
        <h2 className={classes["section-header"]}>
          <IconCreator icons={gameHubSectionIcons} iconName={"vsComputer"} iconClass={classes["time-selection-icon"]} />
          <span>Offline Game</span>
        </h2>
      );

    if (onInviteToPrivateGame)
      return (
        <h2 className={classes["section-header"]}>
          <IconCreator icons={gameHubSectionIcons} iconName={"vsFriend"} iconClass={classes["time-selection-icon"]} />
          <span>Private Game</span>
        </h2>
      );

    return <></>;
  };
  //*/

  return (
    <div data-testid="main-page-vs-player-section" className={classes.search}>
      <div className={classes.search__grid}>
        <div className={classes.search__grid__header}>
          {displaySectionHeader()}
          <span>Select Time Control</span>
        </div>

        {/* map game timing types */}
        {defaultTimeControls.map((control: TimeControl, index: number) => (
          <div key={`row-${index}`} className={classes.search__grid__row}>
            {/* row header */}
            <div className={classes.search__grid__row__header}>
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
                className={classes.search__grid__row__block}
                onClick={() => {
                  onControlSelected(control.header, control.values[i]);
                }}
              >
                {transformTag(tag)}
              </div>
            ))}
            {/* --- */}
          </div>
        ))}
        {/* --- */}
      </div>
    </div>
  );
}

export default TimeSelection;