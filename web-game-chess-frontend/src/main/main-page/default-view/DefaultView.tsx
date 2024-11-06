import { useRef } from "react";
import classes from "./DefaultView.module.scss";
import { GameSearchInterface } from "../../../shared/utils/objects/interfacesEnums";
import BackgroundBoard from "./background-board/BackgroundBoard";
import OngoingGames from "./ongoing-games/OngoingGames";
import LastGames from "./last-games/LastGames";
import ProfileWindow from "./profile-window/ProfileWindow";

type DefaultViewProps = {
  setInterfaceById: (interfaceId: GameSearchInterface) => void;
};

function DefaultView({ setInterfaceById }: DefaultViewProps) {
  ///

  // default section ref
  const defaultViewRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={defaultViewRef} data-testid="main-page-default-view" className={classes.default}>
      <div className={classes.default__container}>
        <div className={classes["board-container"]}>
          <BackgroundBoard defaultViewRef={defaultViewRef} />
        </div>

        <ProfileWindow />

        <OngoingGames setInterfaceById={setInterfaceById} />

        <LastGames setInterfaceById={setInterfaceById} />
      </div>
    </div>
  );
}

export default DefaultView;
