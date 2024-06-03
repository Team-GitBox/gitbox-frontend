import React, { useState } from 'react';
import '../module/CreateWorkspace.css';

function CreateWorkspace() {
  const [name, setName] = useState('');
  const [memberEmails, setMemberEmails] = useState(['']);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMemberEmailChange = (index, event) => {
    const newMemberEmails = [...memberEmails];
    newMemberEmails[index] = event.target.value;
    setMemberEmails(newMemberEmails);
  };

  const addMemberEmail = () => {
    setMemberEmails([...memberEmails, '']);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const workspaceData = { name, memberEmails };

    try {
      const response = await fetch('/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceData),
      });

      if (response.ok) {
        // 요청이 성공적으로 완료되면 /file로 이동
        window.location.href = '/file';
      } else {
        // 요청이 실패하면 에러 처리
        console.error('Failed to create workspace');
        window.location.href = '/file'; // 요청이 실패했을 때는 오면 안됨. 백엔드와 연결 후 삭제!
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="centered-form">
        <form onSubmit={handleSubmit} className="centered-form">
          <div>
            <label className="centered-input">워크스페이스 이름:</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="centered-input"
            />
          </div>
          {memberEmails.map((email, index) => (
            <div key={index}>
              <label className="centered-input">멤버 이메일:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleMemberEmailChange(index, e)}
                className="centered-input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addMemberEmail}
            className="centered-input"
          >
            맴버 추가
          </button>
          <button type="submit" className="centered-input">
            워크스페이스 생성
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkspace;