import { Route, Routes } from "react-router-dom";
import IndexPage from "./index-page/IndexPage";
import RegisterPage from "./register-page/RegisterPage";
import { PopupProvider } from "../shared/utils/hooks/usePopUp";
import AboutPage from "./about-page/AboutPage";

function IndexRouter() {
  ///

  return (
    <PopupProvider>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/registration" element={<RegisterPage />} />
        <Route path="/about/:contentName" element={<AboutPage />} />
      </Routes>
    </PopupProvider>
  );
}

export default IndexRouter;
