import { Route, Routes } from 'react-router-dom';

import HomePage from './home-page/HomePage';

const HomeRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default HomeRouter;
