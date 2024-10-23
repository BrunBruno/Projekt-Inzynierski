import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import IndexRouter from "./index/IndexRouter";
import MainRouter from "./main/MainRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/main/*" element={<MainRouter />} />
        <Route path="/*" element={<IndexRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
