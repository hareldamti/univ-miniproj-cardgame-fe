import React from 'react';

import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Login from './Screens/Login';
import ChooseRoom from './Screens/ChooseRoom';
import Match from './Screens/Match';
import { AppContext } from './State/AppState';

function App() {
  return (
    <AppContext value={{username: undefined}} >
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/lobby" element={<ChooseRoom />} />
              <Route path="/match" element={<Match />} />
          </Routes>
      </BrowserRouter>
    </AppContext>
  );
}


export default App;
