import axios from "axios";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { defaultViewIcons } from "../DefaultViewIcons";
import classes from "./QuickGame.module.scss";
import { QuickTimeControl, quickTimeControls } from "./QuickGameData";
import { SearchWebGameDto } from "../../../../shared/utils/types/webGameDtos";
import { getAuthorization, webGameController } from "../../../../shared/utils/services/ApiService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { SearchWebGameModel } from "../../../../shared/utils/types/webGameModels";
import { getEnumValueByKey } from "../../../../shared/utils/functions/enums";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction } from "react";

type QuickGameProps = {
  // to set new web game data
  setOnlineGameIds: Dispatch<SetStateAction<SearchWebGameDto | null>>;
};

function QuickGame({ setOnlineGameIds }: QuickGameProps) {
  ///

  const { showPopup } = usePopup();

  // to search for online game
  const onSearchForOnlineGame = async (header: TimingTypeName, values: [number, number]): Promise<void> => {
    if (!setOnlineGameIds) return;

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

  return (
    <div className={classes.quick}>
      <div className={classes.quick__header}>
        <IconCreator icons={defaultViewIcons} iconName={"quick"} iconClass={classes["quick-icon"]} />

        <h2 className={classes["heading"]}>Quick game</h2>

        <IconCreator icons={defaultViewIcons} iconName={"quick"} iconClass={classes["quick-icon"]} />
      </div>
      <div className={classes.quick__controls}>
        {quickTimeControls.map((control: QuickTimeControl, index: number) => (
          <div
            key={`time-control-${index}`}
            className={classes["time-control"]}
            onClick={() => {
              onSearchForOnlineGame(control.header, control.value);
            }}
          >
            <IconCreator
              icons={timingTypeIcons}
              iconName={control.header}
              iconClass={`${classes["timing-icon"]} ${classes[control.header]}`}
              color={greyColor.c4}
            />
            {transformTag(control.tag)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickGame;
