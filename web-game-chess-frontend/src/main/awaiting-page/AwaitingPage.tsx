import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import GameHubService from "../../shared/utils/services/GameHubService";
import { useTimingType } from "../../shared/utils/hooks/useTimingType";
import { HubConnectionState } from "@microsoft/signalr";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import axios from "axios";
import { CheckIfUpdateRequiredDto, GetGameTimingDto } from "../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/services/ApiService";
import SearchingPage from "../../shared/components/searching-page/SearchingPage";

function AwaitingPage() {
  ///

  const navigate = useNavigate();

  // game id from route
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  // game id as Guid
  const [gameId, setGameId] = useState<Guid | null>(null);

  const { timingType, setTimingType } = useTimingType();
  const { showPopup } = usePopup();

  // set game id as Guid
  useEffect(() => {
    if (gameIdStr) {
      const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guid);

      getTimingType(guid);
    } else {
      navigate("/main", {
        state: {
          popupText: "Error starting game.",
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

        console.log(response.data);

        if (response.data.isRequired) {
          await GameHubService.UpdatePrivateGame(gameId);
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
      navigate(`/main/game/${gameId}`, {
        state: {
          timing: timingType,
          popupText: "Game started.",
          popupType: "info",
        },
      });
    } else {
      navigate("/main", {
        state: {
          popupText: "Error starting game.",
          popupType: "warning",
        },
      });
    }
  };

  const handleGameDeclined = () => {
    navigate("/main", {
      state: {
        popupText: "Invitation declined.",
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

  //
  const getTimingType = async (gameId: Guid) => {
    try {
      const response = await axios.get<GetGameTimingDto>(gameControllerPaths.getGameTiming(gameId), getAuthorization());

      setTimingType(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  //
  const onCancelPrivateGame = async () => {
    if (gameId) {
      try {
        await axios.delete(gameControllerPaths.cancelPrivateGame(gameId), getAuthorization());

        navigate("/main", {
          state: {
            popupText: "Game canceled.",
            popupType: "error",
          },
        });
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    }
  };
  //*/

  return <SearchingPage isPrivate={true} onCancel={onCancelPrivateGame} />;
}

export default AwaitingPage;
