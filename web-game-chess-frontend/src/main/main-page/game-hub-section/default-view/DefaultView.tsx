import { useRef } from "react";
import classes from "./DefaultView.module.scss";
import DefaultViewBoard from "./default-view-board/DefaultViewBoard";
import DefaultViewProfileWindow from "./default-view-profile-window/DefaultViewProfileWindow";
import DefaultViewLastGames from "./default-view-last-game/DefaultViewLastGame";
import { GameSearchInterface } from "../../../../shared/utils/objects/interfacesEnums";

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
        <DefaultViewBoard defaultViewRef={defaultViewRef} />

        <DefaultViewProfileWindow />

        <DefaultViewLastGames setInterfaceById={setInterfaceById} />
      </div>
    </div>
  );
}

export default DefaultView;
