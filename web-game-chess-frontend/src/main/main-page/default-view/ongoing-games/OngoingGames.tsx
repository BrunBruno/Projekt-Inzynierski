import classes from "./OngoingGames.module.scss";
import { useEffect, useState } from "react";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { GameSearchInterface } from "../../../../shared/utils/objects/interfacesEnums";
import { GetAllActiveGamesDto } from "../../../../shared/utils/types/webGameDtos";
import { GetAllActiveGamesModel } from "../../../../shared/utils/types/webGameModels";
import axios from "axios";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import OngoingGameCard from "./ongoing-game-card/OngoingGameCard";
import { mainPageIcons } from "../../MainPageIcons";
import { SetInterfaceById } from "../../MainPageData";

type OngoingGamesProps = {
  // for setting interface to active games
  setInterfaceById: SetInterfaceById;
};

function OngoingGames({ setInterfaceById }: OngoingGamesProps) {
  ///

  const { showPopup } = usePopup();

  // obtained game list
  const [games, setGames] = useState<GetAllActiveGamesDto[] | null>(null);

  // get all finished games
  useEffect(() => {
    // get last three games
    const getGames = async (): Promise<void> => {
      const model: GetAllActiveGamesModel = {
        pageNumber: 1,
        pageSize: 3,
      };

      try {
        const response = await axios.get<PagedResult<GetAllActiveGamesDto>>(
          webGameController.getAllActiveGames(model),
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
    setInterfaceById(GameSearchInterface.activeGames);
  };

  if (!games || games.length === 0) return <></>;

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <IconCreator
          icons={mainPageIcons}
          iconName={"activeGames"}
          iconClass={classes["header-icon"]}
          color={greyColor.c0}
        />
        <span>Active Games</span>
      </div>

      <div className={classes.games__cards}>
        {games.length !== 0 && (
          <div className={classes.games__cards__list}>
            {games.map((game: GetAllActiveGamesDto, i: number) => (
              <OngoingGameCard key={`game-${i}`} game={game} />
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

export default OngoingGames;
