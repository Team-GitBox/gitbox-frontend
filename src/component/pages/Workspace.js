import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../module/Workspace.css';



function Workspace() {
  const [workspace, setWorkspace] = useState({
    workspaceId: '',
    workspaceName: '',
    ownerInfo: [],
    memberInfo: [],
    maxStorage: '',
    usedStorage: ''
  });

  const { workspaceId } = useParams(); 
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteWorkspace = async () => {
    try {
      if (window.confirm('이 워크스페이스를 삭제하시겠습니까?')) {
        setIsDeleting(true);
        await fetch(`http://125.250.17.196:1234/api/WorkSpace/${workspaceId}`, {
          method: 'DELETE',
      });
      console.log('Workspace deleted successfully');
    }
  } catch (error) {
      console.error('Error deleting workspace:', error);
  } finally {
      setIsDeleting(false);
  }
};
  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const response = await fetch(`http://125.250.17.196:1234/api/WorkSpace/${workspaceId}`);
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
  }, [workspaceId]);

  useEffect(() => {
    // 더미 데이터
    const dummyFiles = 
      {
        "workspaceId": "123",
        "workspaceName": "MyWorkspace",
        "ownerInfo": [
          {
            "ownerName": "Kim",
            "ownerEmail": "Kim@example.com"
          }
        ],
        "memberInfo": [
          {
            "memberName": "Lee",
            "memberEmail": "Lee@example.com"
          },
          {
            "memberName": "Park",
            "memberEmail": "Park@example.com"
          }
        ],
        "maxStorage": "100GB",
        "usedStorage": "50GB"
      }
    ;
   

      setWorkspace(dummyFiles); // 더미 파일 정보로 상태 업데이트
  }, []);

  return (
    <div className="App">
    <div className="center">
    <div className="workspace-container">
    <div className="workspace-card">
      <h2>워크스페이스 상세 정보</h2>
      <button className='workspace-button' onClick={() => window.location.href = '/create-workspace'}>워크스페이스 추가</button>
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
      <div className="workspace-button">
        <button
          onClick={handleDeleteWorkspace}
          disabled={isDeleting}>
          {isDeleting ? '삭제 중...' : '워크스페이스 삭제'}
        </button>
      </div>
    </div>
  </div>
  </div>
      </div>
  );
}

export default Workspace;
