import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./EngineGamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { engineController, getAuthorization } from "../../shared/utils/services/ApiService";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameContent from "./game-content/GameContent";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { Guid } from "guid-typescript";
import { StateOptions } from "../../shared/utils/objects/interfacesEnums";
import { GetEngineGameDto } from "../../shared/utils/types/engineDtos";

function EngineGamePage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // obtained game id from url
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  const [gameId, setGameId] = useState<Guid | null>(null);

  // set game id as Guid
  useEffect(() => {
    if (gameIdStr) {
      const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guid);
    } else {
      const state: StateOptions = {
        popup: { text: "ERROR STARTING GAME", type: "error" },
      };

      navigate("/main", { state: state });
    }
  }, [gameIdStr]);
  //*/

  // obtained game data
  const [gameData, setGameData] = useState<GetEngineGameDto | null>(null);

  // return if no timing set
  // display enter popups
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }
  }, [location.state]);

  useEffect(() => {
    // get game data
    const getGame = async (): Promise<void> => {
      try {
        if (!gameId) return;

        const response = await axios.get<GetEngineGameDto>(engineController.getEngineGame(gameId), getAuthorization());

        setGameData(response.data);

        console.log(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGame();
  }, [gameId]);

  if (!gameId || !gameData) return <LoadingPage />;

  return (
    <main className={classes["game-main"]}>
      {/* <LeftSideBar
        gameId={gameId}
        playerData={playerData}
        gameData={gameData}
        setShowConfirm={setShowConfirm}
        setConfirmAction={setConfirmAction}
      /> */}

      <div></div>

      <GameContent gameId={gameId} gameData={gameData} />

      <div></div>

      {/* <RightSideBar
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        playersTimes={playersTimes}
        setPlayersTimes={setPlayersTimes}
        winner={winner}
      /> */}

      <MainPopUp />
    </main>
  );
}

export default EngineGamePage;
