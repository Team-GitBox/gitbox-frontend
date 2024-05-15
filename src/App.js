import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './component/Login';
import Signup from './component/Signup';
import File from './component/File';

function App() {
   return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<File/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<logout />} />
          <Route path="/file" element={<File />} />
          
        </Routes>
      </BrowserRouter>
    </div>
   
  );
}

export default App;
