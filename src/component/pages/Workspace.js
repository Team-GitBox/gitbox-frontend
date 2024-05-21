import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



function Workspace() {
  const [workspace, setWorkspace] = useState({
    workspaceId: '',
    workspaceName: '',
    ownerInfo: [],
    memberInfo: [],
    maxStorage: '',
    usedStorage: ''
  });

  const { workspaceName } = useParams(); // useParams 훅을 사용하여 URL 파라미터에서 workspaceName을 추출합니다.
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteWorkspace = async () => {
    try {
      setIsDeleting(true);
      await fetch(`http://localhost:3000/WorkSpace/${workspaceName}`, {
        method: 'DELETE',
    });
    
      console.log('Workspace deleted successfully');
  } catch (error) {
      console.error('Error deleting workspace:', error);
  } finally {
      setIsDeleting(false);
  }
};
  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/WorkSpace/${workspaceName}`); // match.params.workspaceName 대신 workspaceName을 사용
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWorkspace(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchWorkspaceDetails(); 
  }, [workspaceName]);
  

  return (
    <div>
      <h2>워크스페이스 상세 정보</h2>
      <p>ID: {workspace.workspaceId}</p>
      <p>이름: {workspace.workspaceName}</p>
      <div>
        <h3>소유자 정보</h3>
        <ul>
          {workspace.ownerInfo.map((owner, index) => (
            <li key={index}>{owner.ownerName} ({owner.ownerEmail})</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>멤버 정보</h3>
        <ul>
          {workspace.memberInfo.map((member, index) => (
            <li key={index}>{member.memberName} ({member.memberEmail})</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>최대 용량</h3>
        <p>{workspace.maxStorage}</p>
        <h3>현재 용량</h3>
        <p>{workspace.usedStorage}</p>
      </div>
      <div>
      <button 
        onClick={handleDeleteWorkspace}
        disabled={isDeleting}>
        {isDeleting ? '삭제 중...' : '워크스페이스 삭제'}
      </button>
    </div>
    </div>
  );
}

export default Workspace;
