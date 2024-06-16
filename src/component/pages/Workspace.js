import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../module/Workspace.css';



function Workspace() {
  const [workspace, setWorkspace] = useState(null);
  const { workspaceId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = async () => {
    try {
      const response = await fetch(
        `http://125.250.17.196:1234/api/workspace/${workspaceId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            memberEmails: [newMemberEmail],
          }),
        }
      );

      if (response.ok) {
        // 멤버 추가 성공 처리
        setNewMemberEmail('');
        setShowMemberForm(false);
        // 워크스페이스 정보 다시 가져오기
        fetchWorkspaces();
      } else {
        // 멤버 추가 실패 처리
        console.error('Failed to add member:', response.status);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };


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

  function formatStorage(sizeInBytes) {
    if (sizeInBytes < 1000) {
      return sizeInBytes + " Bytes";
    } else if (sizeInBytes < 1000000) {
      return (sizeInBytes / 1000).toFixed(2) + " KB";
    } else if (sizeInBytes < 1000000000) {
      return (sizeInBytes / 1000000).toFixed(2) + " MB";
    } else {
      return (sizeInBytes / 1000000000).toFixed(2) + " GB";
    }
  }


  useEffect(() => {
    fetchWorkspaces();
  }, [workspaceId, token, navigate]);

  if (!workspace) {
    return <div>Loading...</div>;
  }

  const { message, data } = workspace;
  const { workspaceName, rootFolderId, ownerInfo, memberInfo, maxStorage, usedStorage, usedStorageByFileType } = data;
  const handlebackbtn = () => {
    navigate(-1);
  }
  const createWorkspace1 = () => {
    navigate("/create-workspace");
  }

  return (
    <div className="workspace-container">
      <div className="workspace-grid">
        <div className="grid-item123">
          <h2>워크스페이스 정보</h2>
          <p className='title'>Workspace Name: {workspaceName}</p>
          <h2>워크스페이스 소유자 정보</h2>
          <p className='title'>Email: {ownerInfo.ownerEmail}</p>
          <p className='title'>Name: {ownerInfo.ownerName}</p>
          <button className="btn123" onClick={createWorkspace1}>워크스페이스 추가</button>
        </div>
        <div className="grid-item123">
          <h2>멤버 정보</h2>

          {memberInfo.map((member, index) => (
            <div className='nested-container'>
              <p className='title'>Email: {member.memberEmail}</p>
              <p className='title'>Name: {member.memberName}</p>
            </div>
          ))}

          <button className='btn123' onClick={() => setShowMemberForm(true)}>멤버 추가</button>

          {showMemberForm && (
            <div>
              <input
                className='btn123'
                type="email"
                placeholder="멤버 이메일"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <button className='btn123' onClick={handleAddMember}>저장</button>
            </div>
          )}

        </div>
        <div className="grid-item123">
          <h2>저장소 정보</h2>
          <p className='title'>Max Storage: {formatStorage(maxStorage)}</p>
          <p className='title'>Used Storage: {formatStorage(usedStorage)}</p>
          <div className='fake-btn'></div>
        </div>
        <div className="grid-item123">
          <h2>파일 유형별 용량</h2>
          {Object.entries(usedStorageByFileType).map(([fileType, size], index) => (
            <div key={index}>
              <p className='title'>{fileType}: {formatStorage(size)}</p>
            </div>
          ))}
          <button
            className='btn123'
            onClick={handleDeleteWorkspace}
            disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '워크스페이스 삭제'}
          </button>
        </div>
      </div>
      <button className='back-page-btn' onClick={handlebackbtn}>뒤로 가기</button>
    </div >
  );
}

export default Workspace;