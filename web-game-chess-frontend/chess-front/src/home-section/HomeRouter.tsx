import { Route, Routes } from 'react-router-dom';

import HomePage from './home-page/HomePage';

function HomeRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default HomeRouter;
