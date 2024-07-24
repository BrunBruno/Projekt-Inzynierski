import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthorization, userControllerPaths } from "../shared/utils/services/ApiService";
import LoadingPage from "../shared/components/loading-page/LoadingPage";
import { GetUserDto, IsEmailVerifiedDto } from "../shared/utils/types/userDtos";
import GamePage from "./game-page/GamePage";
import UsersPage from "./users-page/UsersPage";
import GameHubService from "../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import AccountPage from "./account-page/AccountPage";
import { PopupProvider } from "../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../shared/utils/functions/displayError";
import ProfilePage from "./profile-page/ProfilePage";

function MainRouter() {
  const navigate = useNavigate();

  const [authorize, setAuthorize] = useState<boolean>(false);

  // authorize user
  useEffect(() => {
    const verifyUsersToken = async () => {
      try {
        const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(
          userControllerPaths.isVerified(),
          getAuthorization()
        );

        const isVerified = isVerifiedResponse.data.isEmailVerified;
        if (!isVerified) {
          navigate("/registration", {
            state: {
              popupText: "Account not verified",
              popupType: "error",
            },
          });
          return;
        }

        const userInfoResponse = await axios.get<GetUserDto>(userControllerPaths.getUser(), getAuthorization());

        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

        const token = localStorage.getItem("token");
        if (token === null) {
          navigate("/registration", {
            state: {
              popupText: "Please, log in",
              popupType: "error",
            },
          });
          return;
        }

        await GameHubService.startConnectionWithToken(token);

        if (GameHubService.connection?.state === HubConnectionState.Connected) {
          await GameHubService.AddSelfNotification();

          setAuthorize(true);
        }
      } catch (err) {
        navigate("/", {
          state: {
            popupText: getErrMessage(err),
            popupType: "warning",
          },
        });
      }
    };

    verifyUsersToken();
  }, []);

  if (!authorize) {
    return <LoadingPage />;
  }

  return (
    <PopupProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
    </PopupProvider>
  );
}

export default MainRouter;
