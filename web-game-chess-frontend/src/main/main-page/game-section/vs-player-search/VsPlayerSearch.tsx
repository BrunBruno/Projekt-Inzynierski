import axios from "axios";
import classes from "./VsPlayerSearch.module.scss";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { defaultTimeControls } from "./VsPlayerSearchObjects";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { timingTypes } from "../../../../shared/utils/enums/entitiesEnums";
import { SearchGameModel } from "../../../../shared/utils/types/gameModels";
import TimingTypesIcons from "../../../../shared/svgs/TimingTypesIcons";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { useTimingType } from "../../../../shared/utils/hooks/useTimingType";

type VsPlayerSearchProps = {
  setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
};

function VsPlayerSearch({ setSearchIds }: VsPlayerSearchProps) {
  ///

  const { showPopup } = usePopup();

  const { setTimingType } = useTimingType();

  // API call search for game
  const onSearchForGame = async (header: string, values: number[]) => {
    const typeValue = timingTypes[header.toLocaleLowerCase()];

    const gameType: SearchGameModel = {
      type: typeValue,
      minutes: values[0],
      increment: values[1],
    };

    try {
      const searchGameResponse = await axios.post<SearchGameDto>(
        gameControllerPaths.startSearch(),
        gameType,
        getAuthorization()
      );

      setTimingType(gameType);

      setSearchIds(searchGameResponse.data);

      await GameHubService.PlayerJoined(searchGameResponse.data.timingId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // display time controlls buttons
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

  return (
    <div className={classes.search}>
      <div className={classes.search__grid}>
        <div className={classes.search__grid__header}>
          <span>Select Time Control</span>
        </div>
        {defaultTimeControls.map((control, index) => (
          <div key={index} className={classes.search__grid__row}>
            <div className={classes.search__grid__row__header}>
              <TimingTypesIcons iconName={control.header.toLocaleLowerCase()} iconClass={classes["header-icon"]} />
              {control.header}
            </div>
            {control.tags.map((tag, i) => (
              <div
                key={i}
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
      </div>
    </div>
  );
}

export default VsPlayerSearch;
