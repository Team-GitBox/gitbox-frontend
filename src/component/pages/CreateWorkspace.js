import React, { useState } from 'react';
import '../module/CreateWorkspace.css';
import { useNavigate, Link, useParams, useSearchParams} from 'react-router-dom';

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
        const data = await response.json();
        const workspaceId = data.id;

        // 새로운 멤버 이메일 추가 요청
        await addMemberEmails(workspaceId, memberEmails);

        // 요청이 성공적으로 완료되면 /file로 이동
        window.location.href = '/file';
      } else {
        // 요청이 실패하면 에러 처리
        console.error('Failed to create workspace');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addMemberEmails = async (workspaceId, memberEmails) => {
    const apiUrl = `http://125.250.17.196:1234/api/workspace/${workspaceId}/members`;
    const requestData = { memberEmails: memberEmails.filter(email => email.trim() !== '') };

    await postRequestWithToken(apiUrl, requestData);
  };

  const navigate = useNavigate();
  const handlebackbtn = () => {
    navigate(-1);
  }

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
                type="email"
                value={email}
                onChange={(e) => handleMemberEmailChange(index, e)}
                className="centered-input"
              />
            </div>
          ))}
          <button type="button" onClick={addMemberEmail} className="centered-input">
            멤버 추가
          </button>
          <button type="submit" className="centered-input">
            워크스페이스 생성
          </button>
          <button className='back-page-btn' onClick={handlebackbtn}>뒤로 가기</button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkspace;
