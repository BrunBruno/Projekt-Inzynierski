import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import GameHubService from "../../shared/utils/services/GameHubService";
import { useTimingType } from "../../shared/utils/hooks/useTimingType";
import { HubConnectionState } from "@microsoft/signalr";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/displayError";
import axios from "axios";
import { CheckIfUpdateRequiredDto } from "../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/services/ApiService";
import { UpdatePrivateGameModel } from "../../shared/utils/types/gameModels";

function AwaitingPage() {
  ///

  const navigate = useNavigate();

  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  const [gameId, setGameId] = useState<Guid | null>(null);

  const { timingType } = useTimingType();
  const { showPopup } = usePopup();

  // set game id as Guid
  useEffect(() => {
    if (gameIdStr) {
      const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guid);
    } else {
      navigate("/main", {
        state: {
          popupText: "Error starting game",
          popupType: "warning",
        },
      });
    }
  }, [gameIdStr]);
  //*/

  // to check if update is required
  // used for game via urls
  useEffect(() => {
    const updateIfRequired = async (): Promise<void> => {
      if (!gameId) return;

      try {
        const response = await axios.get<CheckIfUpdateRequiredDto>(
          gameControllerPaths.checkIfUpdateRequired(gameId),
          getAuthorization()
        );

        if (response.data.isRequired) {
          const model: UpdatePrivateGameModel = {
            gameId: gameId,
          };

          await GameHubService.UpdatePrivateGame(model);
        }
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    updateIfRequired();
  }, [gameId]);
  //*/

  // to navigate to game page
  // used for every private game
  const handleGameAccepted = (gameId: Guid) => {
    if (timingType) {
      navigate(`game/${gameId}`, {
        state: {
          timing: timingType,
          popupText: "Game started",
          popupType: "info",
        },
      });
    } else {
      navigate("/main", {
        state: {
          popupText: "Error starting game",
          popupType: "warning",
        },
      });
    }
  };

  const handleGameDeclined = () => {
    navigate("/main", {
      state: {
        popupText: "Invitation declined",
        popupType: "error",
      },
    });
  };
  //*/

  // connect hub methods
  useEffect(() => {
    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("GameAccepted", handleGameAccepted);
      GameHubService.connection.on("InvitationDeclined", handleGameDeclined);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GameAccepted", handleGameAccepted);
        GameHubService.connection.off("InvitationDeclined", handleGameDeclined);
      }
    };
  }, [timingType]);
  //*/

  return <LoadingPage text="Waiting for oppoent..." />;
}

export default AwaitingPage;
