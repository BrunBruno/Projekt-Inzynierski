import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { engineGameController, getAuthorization } from "../../shared/utils/services/ApiService";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { Guid } from "guid-typescript";
import { GameActionInterface, GameWindowInterface, StateOptions } from "../../shared/utils/objects/interfacesEnums";
import { EndEngineGameDto, GetEngineGameDto } from "../../shared/utils/types/engineGameDtos";
import { EndEngineGameModel } from "../../shared/utils/types/engineGameModels";
import { PieceColor } from "../../shared/utils/objects/entitiesEnums";
import EngineGameLeftSidebar from "./game-left-sidebar/EngineGameLeftSidebar";
import EngineGameContent from "./game-content/EngineGameContent";
import EngineGameRightSidebar from "./game-right-sidebar/EngineGameRightSidebar";
import { MoveDto } from "../../shared/utils/types/abstractDtosAndModels";

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

  // obtained game data
  const [gameData, setGameData] = useState<GetEngineGameDto | null>(null);
  // winner data
  const [winner, setWinner] = useState<EndEngineGameDto | null>(null);

  //
  const [displayedWindow, setDisplayedWindow] = useState<GameWindowInterface>(GameWindowInterface.none);
  // states for displaying actions confirmation window
  const [showConfirm, setShowConfirm] = useState<GameActionInterface | null>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // for showing done moves
  const [historyPosition, setHistoryPosition] = useState<MoveDto | null>(null);

  // display enter popups
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }
  }, [location.state]);

  // get game data
  const getGame = async (): Promise<void> => {
    try {
      if (!gameId) return;

      const response = await axios.get<GetEngineGameDto>(
        engineGameController.getEngineGame(gameId),
        getAuthorization()
      );

      setGameData(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    getGame();
  }, [gameId]);

  // to finish the game and get winner data
  const endGame = async (loserColor: PieceColor | null): Promise<void> => {
    if (!gameId) return;

    try {
      const model: EndEngineGameModel = {
        gameId: gameId,
        loserColor: loserColor,
      };

      const response = await axios.put<EndEngineGameDto>(
        engineGameController.endEngineGame(gameId),
        model,
        getAuthorization()
      );

      setWinner(response.data);
      setDisplayedWindow(GameWindowInterface.winner);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to get winner if game has ended
  useEffect(() => {
    if (!gameId || !gameData) return;

    if (gameData.hasEnded) endGame(null);

    if (gameData.halfmoveClock >= 100) {
      endGame(null);
    }
  }, [gameData]);

  if (!gameId || !gameData) return <LoadingPage />;

  return (
    <main className={classes["game-main"]}>
      <EngineGameLeftSidebar
        gameId={gameId}
        gameData={gameData}
        getGame={getGame}
        endGame={endGame}
        setShowConfirm={setShowConfirm}
        setConfirmAction={setConfirmAction}
        displayedWindowState={{ get: displayedWindow, set: setDisplayedWindow }}
      />

      <EngineGameContent
        gameId={gameId}
        gameData={gameData}
        getGame={getGame}
        endGame={endGame}
        winner={winner}
        historyPositionState={{ get: historyPosition, set: setHistoryPosition }}
        showConfirmState={{ get: showConfirm, set: setShowConfirm }}
        confirmAction={confirmAction}
        displayedWindowState={{ get: displayedWindow, set: setDisplayedWindow }}
      />

      <EngineGameRightSidebar
        gameId={gameId}
        gameData={gameData}
        historyPositionState={{ get: historyPosition, set: setHistoryPosition }}
        displayedWindowState={{ get: displayedWindow, set: setDisplayedWindow }}
      />

      <MainPopUp />
    </main>
  );
}

export default EngineGamePage;
