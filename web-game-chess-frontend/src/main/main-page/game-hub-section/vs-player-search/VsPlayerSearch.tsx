import axios from "axios";
import classes from "./VsPlayerSearch.module.scss";
import { gameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { SearchGameModel } from "../../../../shared/utils/types/gameModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { displayTimingName, getEnumValueByKey } from "../../../../shared/utils/functions/enums";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction } from "react";
import { defaultTimeControls, TimeControl } from "../../../../shared/utils/objects/gameTimingMaps";

type VsPlayerSearchProps = {
  // to set obtained search ids
  setSearchIds: Dispatch<SetStateAction<SearchGameDto | null>>;
};

function VsPlayerSearch({ setSearchIds }: VsPlayerSearchProps) {
  ///

  const { showPopup } = usePopup();

  // API call search for game
  const onSearchForGame = async (header: TimingTypeName, values: [number, number]): Promise<void> => {
    const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

    const model: SearchGameModel = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const response = await axios.post<SearchGameDto>(gameController.startSearch(), model, getAuthorization());

      setSearchIds(response.data);

      await GameHubService.PlayerJoined(response.data.timingId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // display time controls buttons
  const transformTag = (tag: string): JSX.Element => {
    const transformedTag: JSX.Element[] = [];

    for (let i = 0; i < tag.length; i++) {
      const char = tag[i];
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

  return (
    <div data-testid="main-page-vs-player-section" className={classes.search}>
      <div className={classes.search__grid}>
        <div className={classes.search__grid__header}>
          <span>Select Time Control</span>
        </div>

        {/* map game timing types */}
        {defaultTimeControls.map((control: TimeControl, index: number) => (
          <div key={`row-${index}`} className={classes.search__grid__row}>
            <div className={classes.search__grid__row__header}>
              <IconCreator
                icons={timingTypeIcons}
                iconName={control.header.toLocaleLowerCase() as TimingTypeName}
                iconClass={classes["header-icon"]}
                color={mainColor.c5}
              />
              <span>{displayTimingName(control.header)}</span>
            </div>

            {control.tags.map((tag: string, i: number) => (
              <div
                key={`time-control-${index}-${i}`}
                data-testid={`main-page-vs-player-time-control-${index}-${i}`}
                className={classes.search__grid__row__block}
                onClick={() => {
                  onSearchForGame(control.header, control.values[i]);
                }}
              >
                {transformTag(tag)}
              </div>
            ))}
          </div>
        ))}
        {/* --- */}
      </div>
    </div>
  );
}

export default VsPlayerSearch;
