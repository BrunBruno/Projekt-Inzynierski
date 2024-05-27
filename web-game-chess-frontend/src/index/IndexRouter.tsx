import { Route, Routes } from "react-router-dom";
import IndexPage from "./index-page/IndexPage";
import RegisterPage from "./register-page/RegisterPage";

function IndexRouter() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/registration" element={<RegisterPage />} />
    </Routes>
  );
}

export default IndexRouter;
