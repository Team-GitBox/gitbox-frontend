import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './component/Login';
import Signup from './component/Signup';
import File from './component/File';
import CreateWorkspace from './component/pages/CreateWorkspace';
import Workspace from './component/pages/Workspace';
import EmptyWorkspace from './component/pages/EmptyWorkspace';
import PullRequest from './component/pages/PullRequest';
import CreatePullRequest from './component/pages/CreatePullRequest';

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
          <Route path="/emptyworkspace" element={<EmptyWorkspace />} />
          <Route path="/workspace/:workspaceId" element={<Workspace />} />
          <Route path="/files/:fileId/pr" element={<PullRequest />} />
          <Route path="/files/:parentFileId/add-pr" element={<CreatePullRequest />} />
          
        </Routes>
      </BrowserRouter>
    </div>
   
  );
  
}

export default App;
