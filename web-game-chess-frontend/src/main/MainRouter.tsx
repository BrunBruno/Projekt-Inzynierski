import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthorization, userController } from "../shared/utils/services/ApiService";
import LoadingPage from "../shared/components/loading-page/LoadingPage";
import { GetUserDto, IsEmailVerifiedDto } from "../shared/utils/types/userDtos";
import GamePage from "./game-page/GamePage";
import UsersPage from "./users-page/UsersPage";
import GameHubService from "../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import AccountPage from "./account-page/AccountPage";
import { PopupProvider } from "../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../shared/utils/functions/errors";
import ProfilePage from "./profile-page/ProfilePage";
import { TimingTypeProvider } from "../shared/utils/hooks/useTimingType";
import AwaitingPage from "./awaiting-page/AwaitingPage";

function MainRouter() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  const [authorize, setAuthorize] = useState<boolean>(false);

  // authorize user
  useEffect(() => {
    const verifyUsersToken = async () => {
      const path = location.pathname;

      try {
        const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

        const isVerified = isVerifiedResponse.data.isEmailVerified;
        if (!isVerified) {
          navigate("/registration", {
            state: {
              popupText: "Account not verified.",
              popupType: "error",
              path: path,
            },
          });
          return;
        }

        const userInfoResponse = await axios.get<GetUserDto>(userController.getUser(), getAuthorization());

        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

        const token = localStorage.getItem("token");

        if (token === null) {
          navigate("/registration", {
            state: {
              popupText: "Please, log in.",
              popupType: "error",
              path: path,
            },
          });
          return;
        }

        await GameHubService.startConnectionWithToken(token);

        console.log(GameHubService.connection?.state);

        if (GameHubService.connection?.state === HubConnectionState.Connected) {
          await GameHubService.AddSelfNotification();

          setAuthorize(true);
        }
      } catch (err) {
        navigate("/registration", {
          state: {
            popupText: getErrMessage(err),
            popupType: "warning",
            path: path,
          },
        });
      }
    };

    verifyUsersToken();
  }, []);
  //*/

  if (!authorize) return <LoadingPage />;

  return (
    <TimingTypeProvider>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/await/:gameIdStr" element={<AwaitingPage />} />
          <Route path="/game/:gameIdStr" element={<GamePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/profile/:friendshipId" element={<ProfilePage />} />
        </Routes>
      </PopupProvider>
    </TimingTypeProvider>
  );
}

export default MainRouter;
