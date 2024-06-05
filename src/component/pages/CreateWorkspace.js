import React, { useState } from 'react';
import '../module/CreateWorkspace.css';

async function postRequestWithToken(apiUrl, requestData) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No accessToken in localStorage');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);
      return data; // 성공적인 응답 데이터 반환
    } else {
      console.error('Error Response:', response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

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
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://125.250.17.196:1234/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workspaceData),
      });

      if (response.ok) {
        // 요청이 성공적으로 완료되면 /file로 이동
        window.location.href = '/file';
      } else {
        // 요청이 실패하면 에러 처리
        console.error('Failed to create workspace');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    event.preventDefault(); // 폼 제출 기본 이벤트 방지

    // API 요청을 위한 URL 및 데이터 설정
    const apiUrl = 'http://125.250.17.196:1234/api/workspace';
    const requestData = {
      name: name,
      memberEmails: memberEmails.filter(email => email.trim() !== '') // 빈 이메일 제거
    };

    // postRequestWithToken 함수를 호출하여 토큰을 포함한 POST 요청을 처리
    await postRequestWithToken(apiUrl, requestData);
  };

  return (
    <div className="container">
      <div className="centered-form">
        <form onSubmit={handleSubmit} className="centered-form">
          <div>
            <label className="centered-input">워크스페이스 이름:</label>
            <input type="text" value={name} onChange={handleNameChange} className="centered-input" />
          </div>
          {memberEmails.map((email, index) => (
            <div key={index}>
              <label className="centered-input">멤버 이메일:</label>
              <input
                type="memberEmail"
                value={email}
                onChange={(e) => handleMemberEmailChange(index, e)}
                className="centered-input"
              />
            </div>
          ))}
          <button type="button" onClick={addMemberEmail} className="centered-input">
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