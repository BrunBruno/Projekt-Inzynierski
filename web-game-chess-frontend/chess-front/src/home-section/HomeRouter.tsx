import { Route, Routes } from 'react-router-dom';

import HomePage from './home-page/HomePage';
import RegisterPage from './register-page/RegisterPage';

function HomeRouter() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/" element={<RegisterPage />} />
    </Routes>
  );
}

export default HomeRouter;
