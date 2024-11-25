import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { GameSearchInterface } from "../../../shared/utils/objects/interfacesEnums";
import { SetInterfaceById } from "../MainPageData";
import { mainPageIcons } from "../MainPageIcons";
import classes from "./MainButtons.module.scss";

type MainButtonsProps = {
  // selected interface id for button highlight
  interfaceId: GameSearchInterface;
  // to change interface
  setInterfaceById: SetInterfaceById;
};

function MainButtons({ interfaceId, setInterfaceById }: MainButtonsProps) {
  ///

  return (
    <div className={classes.buttons}>
      <button
        data-testid="main-page-game-hub-default-button"
        className={`
            ${classes["interface-button"]}
            ${interfaceId === GameSearchInterface.defaultView ? classes["active-button"] : ""}`}
        onClick={() => {
          setInterfaceById(GameSearchInterface.defaultView);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"home"} iconClass={classes["home-icon"]} />
        <span>Home</span>
      </button>

      <button
        data-testid="main-page-game-hub-vs-player-button"
        className={`
          ${classes["interface-button"]}
          ${
            interfaceId === GameSearchInterface.vsPlayerTimeSelection ||
            interfaceId === GameSearchInterface.vsPlayerSearching
              ? classes["active-button"]
              : ""
          }`}
        onClick={() => {
          setInterfaceById(GameSearchInterface.vsPlayerTimeSelection);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"vsPlayer"} iconClass={classes["vs-player-icon"]} />
        <span>Play vs Player</span>
      </button>

      <button
        data-testid="main-page-game-hub-vs-computer-button"
        className={`
          ${classes["interface-button"]}
          ${interfaceId === GameSearchInterface.vsComputerOptions ? classes["active-button"] : ""}
        `}
        onClick={() => {
          setInterfaceById(GameSearchInterface.vsComputerOptions);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"vsComputer"} iconClass={classes["vs-computer-icon"]} />
        <span>Play vs Computer</span>
      </button>

      <button
        data-testid="main-page-game-hub-vs-friend-button"
        className={`
          ${classes["interface-button"]}
          ${
            interfaceId === GameSearchInterface.vsFriendsOptions ||
            interfaceId === GameSearchInterface.vsFriendTimeSelection
              ? classes["active-button"]
              : ""
          }`}
        onClick={() => {
          setInterfaceById(GameSearchInterface.vsFriendsOptions);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"vsFriend"} iconClass={classes["vs-friend-icon"]} />
        <span>Play vs Friend</span>
      </button>

      <button
        data-testid="main-page-game-hub-active-games-button"
        className={`
          ${classes["interface-button"]}
          ${interfaceId === GameSearchInterface.activeGames ? classes["active-button"] : ""}
        `}
        onClick={() => {
          setInterfaceById(GameSearchInterface.activeGames);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"activeGames"} iconClass={classes["active-games-icon"]} />
        <span>Active Games</span>
      </button>

      <button
        data-testid="main-page-game-hub-finished-games-button"
        className={`
          ${classes["interface-button"]}
          ${interfaceId === GameSearchInterface.finishedGames ? classes["active-button"] : ""}
        `}
        onClick={() => {
          setInterfaceById(GameSearchInterface.finishedGames);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"userGames"} iconClass={classes["user-games-icon"]} />
        <span>My Games</span>
      </button>

      <button
        data-testid="main-page-game-hub-engine-games-button"
        className={`
          ${classes["interface-button"]}
          ${interfaceId === GameSearchInterface.engineGames ? classes["active-button"] : ""}
        `}
        onClick={() => {
          setInterfaceById(GameSearchInterface.engineGames);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"engineGames"} iconClass={classes["engine-games-icon"]} />
        <span>Engine Games</span>
      </button>

      <button
        data-testid="main-page-game-hub-invitations-button"
        className={`
          ${classes["interface-button"]}
          ${interfaceId === GameSearchInterface.invitations ? classes["active-button"] : ""}
        `}
        onClick={() => {
          setInterfaceById(GameSearchInterface.invitations);
        }}
      >
        <IconCreator icons={mainPageIcons} iconName={"gameInvitations"} iconClass={classes["invitations-icon"]} />
        <span>Invitations</span>
      </button>
    </div>
  );
}

export default MainButtons;
