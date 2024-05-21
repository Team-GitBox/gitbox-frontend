import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './component/Login';
import Signup from './component/Signup';
import File from './component/File';
import CreateWorkspace from './component/pages/CreateWorkspace';
import Workspace from './component/pages/Workspace';


function App() { 
   return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/file" element={<File />} />
          <Route path="/create-workspace" element={<CreateWorkspace />} />
          <Route path="/workspace/{workspaceName}" element={<Workspace />} />
          <Route path="/workspace/{workspaceName}" element={<Workspace />} />
        </Routes>
      </BrowserRouter>
    </div>
   
  );
}

export default App;
