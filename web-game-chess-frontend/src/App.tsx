import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import IndexRouter from "./index/IndexRouter";
import MainRouter from "./main/MainRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<IndexRouter />} />
        <Route path="/main/*" element={<MainRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
