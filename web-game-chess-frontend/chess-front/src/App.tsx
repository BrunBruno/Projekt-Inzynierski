import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.module.scss";
import HomeRouter from "./home-section/HomeRouter";

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/*" element={<HomeRouter/>}/>
    </Routes>
  </BrowserRouter>;
}

export default App;
