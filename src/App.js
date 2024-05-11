import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './component/Login';
import Signup from './component/Signup';


function App() {
   return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<logout />} />
          
        </Routes>
      </BrowserRouter>
    </div>
   
  );
}

export default App;
