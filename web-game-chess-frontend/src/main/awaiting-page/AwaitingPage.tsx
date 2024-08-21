import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import classes from "./AwaitingPage.module.scss";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import GameHubService from "../../shared/utils/services/GameHubService";
import { useTimingType } from "../../shared/utils/hooks/useTimingType";
import { HubConnectionState } from "@microsoft/signalr";
import { usePopup } from "../../shared/utils/hooks/usePopUp";

type AwaitingPageProps = {};

function AwaitingPage({}: AwaitingPageProps) {
  ///

  const navigate = useNavigate();

  //   const { gameIdStr } = useParams<{ gameIdStr: string }>();
  //   const [gameId, setGameId] = useState<Guid | null>(null);

  const { timingType } = useTimingType();
  const { showPopup } = usePopup();

  //   // set game id as Guid
  //   useEffect(() => {
  //     if (gameIdStr) {
  //       const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
  //       setGameId(guid);
  //     } else {
  //       navigate("/main", {
  //         state: {
  //           popupText: "Error starting game",
  //           popupType: "error",
  //         },
  //       });
  //     }
  //   }, [gameIdStr]);

  const handleGameAccepted = (gameId: string) => {
    if (timingType) {
      navigate(`game/${gameId}`, {
        state: {
          timing: timingType,
          popupText: "Game started",
          popupType: "info",
        },
      });
    } else {
      console.error("Type not set");
    }
  };

  const handleGameDeclined = () => {
    showPopup("Invitation declined", "error");
    navigate("/main");
  };

  useEffect(() => {
    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      //   GameHubService.connection.on("GamesChanged", handleGamesChanged);
      GameHubService.connection.on("GameAccepted", handleGameAccepted);
      GameHubService.connection.on("InvitationDeclined", handleGameDeclined);
    }

    return () => {
      if (GameHubService.connection) {
        // GameHubService.connection.off("GamesChanged", handleGamesChanged);
        GameHubService.connection.off("GameAccepted", handleGameAccepted);
        GameHubService.connection.off("InvitationDeclined", handleGameDeclined);
      }
    };
  }, [timingType]);

  return <LoadingPage />;
}

export default AwaitingPage;
