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
import { RegistrationInterface, StateOptions } from "../shared/utils/objects/interfacesEnums";

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
        // check if email is verified
        const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

        const isVerified = isVerifiedResponse.data.isEmailVerified;
        if (!isVerified) {
          const state: StateOptions = {
            popup: { text: "ACCOUNT NOT VERIFIED", type: "error" },
            regOption: RegistrationInterface.verify,
            path: path,
          };

          navigate("/registration", { state: state });
          return;
        }

        // getting user data and validating token
        const userInfoResponse = await axios.get<GetUserDto>(userController.getUser(), getAuthorization());

        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

        const token = localStorage.getItem("token");

        if (token === null) {
          const state: StateOptions = {
            popup: { text: "PLEASE, LOG IN", type: "error" },
            regOption: RegistrationInterface.signIn,
            path: path,
          };

          navigate("/registration", { state: state });
          return;
        }

        // connect to gam hub and add self notifications
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
