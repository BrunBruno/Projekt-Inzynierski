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
import { gameController, getAuthorization } from "../../shared/utils/services/ApiService";
import SearchingPage from "../../shared/components/searching-page/SearchingPage";
import { GameSearchInterface, StateOptions } from "../../shared/utils/objects/interfacesEnums";

function AwaitingPage() {
  ///

  const navigate = useNavigate();
  const { timingType, setTimingType } = useTimingType();
  const { showPopup } = usePopup();

  // game id from route
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  // game id as Guid
  const [gameId, setGameId] = useState<Guid | null>(null);

  // set game id as Guid
  // get game timing for current game
  useEffect(() => {
    const getTimingType = async (gameId: Guid): Promise<void> => {
      try {
        const response = await axios.get<GetGameTimingDto>(gameController.getGameTiming(gameId), getAuthorization());

        setTimingType(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (gameIdStr) {
      const guidGameId: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guidGameId);

      getTimingType(guidGameId);
    } else {
      const state: StateOptions = {
        popup: { text: "ERROR STARTING GAME", type: "warning" },
      };

      navigate("/main", { state: state });
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
          gameController.checkIfUpdateRequired(gameId),
          getAuthorization()
        );

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

  // connect hub methods
  useEffect(() => {
    // to navigate to game page

    const handleGameAccepted = (gameId: Guid): void => {
      if (timingType) {
        const state: StateOptions = {
          popup: { text: "GAME STARTED", type: "info" },
          timing: timingType,
        };

        navigate(`/main/game/${gameId}`, { state: state });
      } else {
        const state: StateOptions = {
          popup: { text: "ERROR STARTING GAME", type: "warning" },
        };

        navigate("/main", { state: state });
      }
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
  }, [timingType, gameId]);
  //*/

  // to remove created private game
  const onCancelPrivateGame = async (): Promise<void> => {
    if (!gameId) return;

    try {
      await axios.delete(gameController.cancelPrivateGame(gameId), getAuthorization());

      const state: StateOptions = {
        popup: { text: "GAME CANCELED", type: "error" },
        interface: GameSearchInterface.vsFriend,
      };

      navigate("/main", { state: state });
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

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
