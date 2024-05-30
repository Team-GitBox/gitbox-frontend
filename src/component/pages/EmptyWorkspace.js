import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../module/EmptyWorkspace.css';

function EmptyWorkspace() {
  const navigate = useNavigate();

  const handleCreateWorkspace = () => {
    navigate('/create-workspace');
  };

  return (
    <div className="container">
      <h1>참여중인 워크스페이스가 없습니다.</h1>
      <br />
      <h2>버튼을 눌러 워크스페이스를 생성하세요.</h2>
      <button className="createWorkspaceBtn" onClick={handleCreateWorkspace}>+</button>
    </div>
  );
}

export default EmptyWorkspace;