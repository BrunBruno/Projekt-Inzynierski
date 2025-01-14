import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthorization, userController } from "../shared/utils/services/ApiService";
import LoadingPage from "../shared/components/loading-page/LoadingPage";
import { GetUserDto, IsEmailVerifiedDto } from "../shared/utils/types/userDtos";
import WebGamePage from "./game-page/WebGamePage";
import UsersPage from "./users-page/UsersPage";
import GameHubService from "../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import AccountPage from "./account-page/AccountPage";
import { PopupProvider } from "../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../shared/utils/functions/errors";
import ProfilePage from "./profile-page/ProfilePage";
import AwaitingPage from "./awaiting-page/AwaitingPage";
import { RegistrationInterface, StateOptions } from "../shared/utils/objects/interfacesEnums";
import NotFoundPage from "../shared/components/not-found-page/NotFoundPage";
import EngineGamePage from "./game-page/EngineGamePage";
import RankingPage from "./ranking-page/RankingPage";

function MainRouter() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  // is users authorized
  const [authorize, setAuthorize] = useState<boolean>(false);

  // authorize user
  useEffect(() => {
    const verifyUsersToken = async (): Promise<void> => {
      // for saving user entered path
      const path = location.pathname;

      try {
        // check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          const state: StateOptions = {
            popup: { text: "PLEASE, LOG IN", type: "error" },
            regOption: RegistrationInterface.signIn,
            path: path,
          };

          navigate("/registration", { state: state, replace: true });
          return;
        }

        // check if email is verified
        const response = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

        const isVerified = response.data.isEmailVerified;
        if (!isVerified) {
          const state: StateOptions = {
            popup: { text: "ACCOUNT NOT VERIFIED", type: "error" },
            regOption: RegistrationInterface.verify,
            path: path,
          };

          navigate("/registration", { state: state, replace: true });
          return;
        }

        // get user data
        const userInfoResponse = await axios.get<GetUserDto>(userController.getUser(), getAuthorization());
        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

        // connect to game hub and add self notifications
        await GameHubService.startConnectionWithToken(token);

        if (GameHubService.connection?.state === HubConnectionState.Connected) {
          await GameHubService.AddSelfNotification();

          // user is authorized
          setAuthorize(true);
        }
      } catch (err) {
        // navigate to registration on error
        const state: StateOptions = {
          popup: { text: getErrMessage(err), type: "warning" },
          path: path,
        };

        navigate("/registration", { state: state });
      }
    };

    verifyUsersToken();
  }, []);

  if (!authorize) return <LoadingPage />;

  return (
    <PopupProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/await/:gameIdStr" element={<AwaitingPage />} />
        <Route path="/game/:gameIdStr" element={<WebGamePage />} />
        <Route path="/engine-game/:gameIdStr" element={<EngineGamePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile/:friendshipIdStr" element={<ProfilePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="*" element={<NotFoundPage path={"/main"} />} />
      </Routes>
    </PopupProvider>
  );
}

export default MainRouter;
