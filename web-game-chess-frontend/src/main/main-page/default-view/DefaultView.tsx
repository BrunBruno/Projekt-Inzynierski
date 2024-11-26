import { Dispatch, SetStateAction, useRef } from "react";
import classes from "./DefaultView.module.scss";
import BackgroundBoard from "./background-board/BackgroundBoard";
import OngoingGames from "./ongoing-games/OngoingGames";
import LastGames from "./last-games/LastGames";
import ProfileWindow from "./profile-window/ProfileWindow";
import ClockWindow from "./clock-window/ClockWindow";
import QuickGame from "./quick-game/QuickGame";
import { SearchWebGameDto } from "../../../shared/utils/types/webGameDtos";
import { SetInterfaceById } from "../MainPageData";

type DefaultViewProps = {
  // for changing interface to user games
  setInterfaceById: SetInterfaceById;
  // for quick games
  setOnlineGameIds: Dispatch<SetStateAction<SearchWebGameDto | null>>;
};

function DefaultView({ setInterfaceById, setOnlineGameIds }: DefaultViewProps) {
  ///

  // default section ref
  const defaultViewRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={defaultViewRef} data-testid="main-page-default-view" className={classes.default}>
      <div className={classes.default__container}>
        {/* background */}
        <div className={classes["board-container"]}>
          <BackgroundBoard defaultViewRef={defaultViewRef} />
        </div>

        {/* def view blocks */}
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
