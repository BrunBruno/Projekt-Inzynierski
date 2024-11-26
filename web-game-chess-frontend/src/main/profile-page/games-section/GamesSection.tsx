import { GetAllFinishedGamesDto } from "../../../shared/utils/types/webGameDtos";
import classes from "./GamesSection.module.scss";

import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";

type GamesSectionProps = {
  // paged result of type history dtos
  games: PagedResult<GetAllFinishedGamesDto> | null;
};

function GamesSection({ games }: GamesSectionProps) {
  ///

  if (!games) return <>tododo</>;

  return (
    <div className={classes.games}>
      <h2 className={classes["games-title"]}></h2>

      <div className={classes.history__items}></div>
    </div>
  );
}

export default GamesSection;
