import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getAuthorization,
  userControllerPaths,
} from "../shared/utils/functions/apiFunctions";
import LoadingPage from "../shared/components/loading-page/LoadingPage";
import { GetUserDto, IsEmailVerifiedDto } from "../shared/utils/types/userDtos";
import GamePage from "./game-page/GamePage";
import UsersPage from "./users-page/UsersPage";
import GameHubService from "../shared/utils/services/GameHubService";

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
          navigate("/");
          return;
        }

        const userInfoResponse = await axios.get<GetUserDto>(
          userControllerPaths.getUser(),
          getAuthorization()
        );

        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

        const token = localStorage.getItem("token");
        if (token === null) {
          navigate("/");
          return;
        }

        GameHubService.startConnectionWithToken(token);

        setTimeout(() => {
          GameHubService.AddSelfNotification();
        }, 1000);

        setAuthorize(true);
      } catch (err) {
        navigate("/");
      }
    };

    verifyUsersToken();
  }, []);

  if (!authorize) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/game/:gameId" element={<GamePage />} />
    </Routes>
  );
}

export default MainRouter;
