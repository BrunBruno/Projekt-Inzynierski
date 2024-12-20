import { useEffect, useState } from "react";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GetAllFinishedGamesDto } from "../../../../shared/utils/types/webGameDtos";
import { GetAllFinishedGamesModel } from "../../../../shared/utils/types/webGameModels";
import axios from "axios";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import classes from "./LastGames.module.scss";
import LastGameCard from "./last-game-card/LastGameCard";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { GameSearchInterface } from "../../../../shared/utils/objects/interfacesEnums";
import { mainPageIcons } from "../../MainPageIcons";
import { SetInterfaceById } from "../../MainPageData";

type LastGamesProps = {
  // for setting finished games interface
  setInterfaceById: SetInterfaceById;
};

function LastGames({ setInterfaceById }: LastGamesProps) {
  ///

  const { showPopup } = usePopup();

  // obtained game list
  const [games, setGames] = useState<GetAllFinishedGamesDto[] | null>(null);

  // get all finished games
  useEffect(() => {
    // get last three games
    const getGames = async (): Promise<void> => {
      const getGamesOptions: GetAllFinishedGamesModel = {
        pageNumber: 1,
        pageSize: 3,
      };

      try {
        const response = await axios.get<PagedResult<GetAllFinishedGamesDto>>(
          webGameController.getAllFinishedGames(getGamesOptions),
          getAuthorization()
        );

        setGames(response.data.items);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGames();
  }, []);

  // set related interface
  const handelMoreGamesClick = (): void => {
    setInterfaceById(GameSearchInterface.finishedGames);
  };

  if (!games || games.length === 0) return <></>;

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <IconCreator
          icons={mainPageIcons}
          iconName={"userGames"}
          iconClass={classes["header-icon"]}
          color={greyColor.c0}
        />
        <span>Last Games</span>
      </div>

      <div className={classes.games__cards}>
        {games.length !== 0 && (
          <div className={classes.games__cards__list}>
            {games.map((game: GetAllFinishedGamesDto, i: number) => (
              <LastGameCard key={`game-${i}`} game={game} />
            ))}
          </div>
        )}

        <div
          className={classes.games__cards__button}
          onClick={() => {
            handelMoreGamesClick();
          }}
        >
          <IconCreator icons={symbolIcons} iconName={"arrow"} color={greyColor.c7} iconClass={classes["more-arrow"]} />
          <IconCreator icons={symbolIcons} iconName={"arrow"} color={greyColor.c7} iconClass={classes["more-arrow"]} />
        </div>
      </div>
    </div>
  );
}

export default LastGames;
