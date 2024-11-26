import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import GameHubService from "../../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import axios from "axios";
import { CheckIfUpdateOnPrivateGameRequiredDto } from "../../shared/utils/types/webGameDtos";
import { webGameController, getAuthorization } from "../../shared/utils/services/ApiService";
import SearchingPage from "../../shared/components/searching-page/SearchingPage";
import { GameSearchInterface, StateOptions } from "../../shared/utils/objects/interfacesEnums";

function AwaitingPage() {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // game id from route
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  // game id as Guid
  const [gameId, setGameId] = useState<Guid | null>(null);

  // set game id as Guid
  // get game timing for current game
  useEffect(() => {
    if (gameIdStr) {
      const guidGameId: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guidGameId);
    } else {
      const state: StateOptions = {
        popup: { text: "ERROR STARTING GAME", type: "warning" },
      };

      navigate("/main", { state: state });
    }
  }, [gameIdStr]);

  // to check if update is required
  // used for game via urls
  useEffect(() => {
    const updateIfRequired = async (): Promise<void> => {
      if (!gameId) return;

      try {
        const response = await axios.get<CheckIfUpdateOnPrivateGameRequiredDto>(
          webGameController.checkIfUpdateRequired(gameId),
          getAuthorization()
        );

        if (response.data.isRequired) {
          await GameHubService.UpdatePrivateGame(gameId);

          const state: StateOptions = {
            popup: { text: "GAME STARTED", type: "info" },
          };

          navigate(`/main/game/${gameId}`, { state: state });
        }
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    updateIfRequired();
  }, [gameId]);

  // connect hub methods
  useEffect(() => {
    // to navigate to game page

    const handleGameAccepted = (gameId: Guid): void => {
      const state: StateOptions = {
        popup: { text: "GAME STARTED", type: "info" },
      };

      navigate(`/main/game/${gameId}`, { state: state });
    };

    // used for every private game
    const handleGameDeclined = (): void => {
      const state: StateOptions = {
        popup: { text: "INVITATION DECLINED.", type: "error" },
      };

      navigate("/main", { state: state });
    };

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
  }, [gameId]);

  // to remove created private game
  const onCancelPrivateGame = async (): Promise<void> => {
    if (!gameId) return;

    try {
      await axios.delete(webGameController.cancelPrivateGame(gameId), getAuthorization());

      const state: StateOptions = {
        popup: { text: "GAME CANCELED", type: "error" },
        interface: GameSearchInterface.vsFriendsOptions,
      };

      navigate("/main", { state: state });
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  if (!gameId) return <></>;

  return (
    <SearchingPage
      isPrivate={true}
      onCancel={onCancelPrivateGame}
      containerTestId="main-awaiting-page-searching"
      cancelButtonTestId="main-awaiting-page-cancel-button"
    />
  );
}

export default AwaitingPage;
