import { useEffect, useState } from "react";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { GetAllFinishedGamesDto } from "../../../../../shared/utils/types/gameDtos";
import { GetAllFinishedGamesModel } from "../../../../../shared/utils/types/gameModels";
import axios from "axios";
import { PagedResult } from "../../../../../shared/utils/types/abstractDtosAndModels";
import { gameController, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import classes from "./LastGames.module.scss";
import LastGameCard from "./last-game-card/LastGameCard";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../../shared/utils/objects/colorMaps";
import { GameSearchInterface } from "../../../../../shared/utils/objects/interfacesEnums";

type LastGamesProps = {
  setInterfaceById: (interfaceId: GameSearchInterface) => void;
};

function LastGames({ setInterfaceById }: LastGamesProps) {
  ///

  const { showPopup } = usePopup();

  // obtained game list
  const [games, setGames] = useState<GetAllFinishedGamesDto[] | null>(null);

  // get all finished games
  useEffect(() => {
    const getGames = async (): Promise<void> => {
      const getGamesOptions: GetAllFinishedGamesModel = {
        pageNumber: 1,
        pageSize: 3,
      };

      try {
        const response = await axios.get<PagedResult<GetAllFinishedGamesDto>>(
          gameController.getAllFinishedGames(getGamesOptions),
          getAuthorization()
        );

        setGames(response.data.items);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGames();
  }, []);
  //*/

  const handelMoreGamesClick = () => {
    setInterfaceById(GameSearchInterface.userGames);
  };

  if (!games || games.length === 0) return <></>;

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <span>Your last games:</span>
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
