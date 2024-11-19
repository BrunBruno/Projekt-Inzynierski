import { Dispatch, SetStateAction, useRef } from "react";
import classes from "./DefaultView.module.scss";
import { GameSearchInterface } from "../../../shared/utils/objects/interfacesEnums";
import BackgroundBoard from "./background-board/BackgroundBoard";
import OngoingGames from "./ongoing-games/OngoingGames";
import LastGames from "./last-games/LastGames";
import ProfileWindow from "./profile-window/ProfileWindow";
import ClockWindow from "./clock-window/ClockWindow";
import QuickGame from "./quick-game/QuickGame";
import { SearchWebGameDto } from "../../../shared/utils/types/gameDtos";

type DefaultViewProps = {
  //
  setInterfaceById: (interfaceId: GameSearchInterface) => void;
  //
  setOnlineGameIds: Dispatch<SetStateAction<SearchWebGameDto | null>>;
};

function DefaultView({ setInterfaceById, setOnlineGameIds }: DefaultViewProps) {
  ///

  // default section ref
  const defaultViewRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={defaultViewRef} data-testid="main-page-default-view" className={classes.default}>
      <div className={classes.default__container}>
        <div className={classes["board-container"]}>
          <BackgroundBoard defaultViewRef={defaultViewRef} />
        </div>

        <div className={classes.default__container__row}>
          <ProfileWindow />

          <ClockWindow />
        </div>

        <div className={classes.default__container__row}>
          <QuickGame setOnlineGameIds={setOnlineGameIds} />
        </div>

        <div className={classes.default__container__row}>
          <OngoingGames setInterfaceById={setInterfaceById} />
        </div>

        <div className={classes.default__container__row}>
          <LastGames setInterfaceById={setInterfaceById} />
        </div>
      </div>
    </div>
  );
}

export default DefaultView;
