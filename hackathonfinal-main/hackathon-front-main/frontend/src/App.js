import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './SignIn/SignIn';
import Register from './Register/Register'; // Import the Register component
import DrawerAppBar from './DrawerAppBar/DrawerAppBar';
import FlowerShop from './FlowerShop/FlowerShop';
import Garden from './Garden/Garden';
import Bouquet from './Bouquet/Bouquet';
import Profile from './Profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} /> {/* Add route for Register */}
        <Route path="/" element={<Navigate to="/sign-in" />} /> {/* Initial route to sign-in */}
        <Route
          path="/*"
          element={
            <>
              <DrawerAppBar />
              <Routes>
                <Route path="/flower-shop" element={<FlowerShop />} />
                <Route path="/garden" element={<Garden />} />
                <Route path="/bouquet" element={<Bouquet />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Navigate to="/flower-shop" />} /> {/* Default route after login */}
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
