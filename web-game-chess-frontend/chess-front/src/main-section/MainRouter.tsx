import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./main-page/MainPage";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  baseUrl,
  getAuthorization,
} from "../shared/utils/functions/getAuthorization";
import LoadingPage from "../shared/components/loading-page/LoadingPage";

function MainRouter() {
  const navigate = useNavigate();

  const [authorize, setAuthorize] = useState<boolean>(false);

  useEffect(() => {
    const verifyUsersToken = async () => {
      try {
        const isVerifiedResponse = await axios.get(
          `${baseUrl}/user/is-verified`,
          getAuthorization()
        );

        const isVerified = isVerifiedResponse.data.isEmailVerified;
        if (!isVerified) {
          navigate("/");
        }

        const userInfoResponse = await axios.get(
          `${baseUrl}/user`,
          getAuthorization()
        );

        localStorage.setItem("userInfo", JSON.stringify(userInfoResponse.data));

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
    </Routes>
  );
}

export default MainRouter;
