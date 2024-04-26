import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.module.scss';
import HomeRouter from './home-section/HomeRouter';
import MainRouter from './main-section/MainRouter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HomeRouter />} />
        <Route path="/main/*" element={<MainRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
