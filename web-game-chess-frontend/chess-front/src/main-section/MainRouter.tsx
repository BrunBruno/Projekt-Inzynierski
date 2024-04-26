import { Route, Routes } from 'react-router-dom';
import MainPage from './main-page/MainPage';

function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}

export default MainRouter;
