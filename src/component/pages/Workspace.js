import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../module/Workspace.css';



function Workspace() {
  const [workspace, setWorkspace] = useState(null);
  const { workspaceId } = useParams(); 
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleDeleteWorkspace = async () => {
    try {
      if (window.confirm('이 워크스페이스를 삭제하시겠습니까?')) {
        setIsDeleting(true);
        const response = await fetch(
          `http://125.250.17.196:1234/api/workspace/${workspaceId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response.ok) {
          // 요청이 성공적으로 완료되면 /file로 이동
          window.location.href = '/file';
        } else {
          // 요청이 실패하면 에러 처리
          console.error('Failed to delete workspace');
        }
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        console.log('Fetching workspaces...');
        const response = await fetch(`http://125.250.17.196:1234/api/workspace`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Workspace response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Workspace data:', data);
        if (data.data.length === 0 || workspaceId === 'null') {
          // 워크스페이스 목록이 비어있는 경우, '/create-workspace'로 이동
          console.log('Workspace list is empty, navigating to /create-workspace');
          navigate('/create-workspace');
        } else {
          // 특정 워크스페이스의 정보를 가져오기
          console.log(`Fetching workspace ${workspaceId} details...`);
          const workspaceResponse = await fetch(`http://125.250.17.196:1234/api/workspace/${workspaceId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Workspace details response:', workspaceResponse);
          if (!workspaceResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const workspaceData = await workspaceResponse.json();
          console.log('Workspace details data:', workspaceData);
          setWorkspace(workspaceData);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    fetchWorkspaces();
  }, [workspaceId, token, navigate]);
  
  if (!workspace) {
    return <div>Loading...</div>;
  }

  const { message, data } = workspace;
  const { workspaceName, rootFolderId, ownerInfo, memberInfo, maxStorage, usedStorage, usedStorageByFileType } = data;


   return (
      <div className="workspace-container">
        <div className="workspace-card">
      <h1>Workspace Info</h1>
      <button className='workspace-button' onClick={() => window.location.href = '/create-workspace'}>워크스페이스 추가</button>
      <p>Message: {message}</p>
      <p>Workspace Name: {workspaceName}</p>
      <p>Root Folder ID: {rootFolderId}</p>
      <h2>Owner Info</h2>
      <p>Email: {ownerInfo.ownerEmail}</p>
      <p>Name: {ownerInfo.ownerName}</p>
      <h2>Member Info</h2>
      {memberInfo.map((member, index) => (
        <div key={index}>
          <p>Email: {member.memberEmail}</p>
          <p>Name: {member.memberName}</p>
        </div>
      ))}
      <h2>Storage Info</h2>
      <p>Max Storage: {maxStorage} bytes</p>
      <p>Used Storage: {usedStorage} bytes</p>
      <h2>Used Storage by File Type</h2>
      {Object.entries(usedStorageByFileType).map(([fileType, size], index) => (
        <div key={index}>
          <p>{fileType}: {size} bytes</p>
        </div>
      ))}
      <div className="workspace-button">
              <button
                onClick={handleDeleteWorkspace}
                disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '워크스페이스 삭제'}
              </button>
            </div>
      </div>
      </div>
  );
}

export default Workspace;
