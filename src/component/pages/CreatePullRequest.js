import React, { useState } from 'react';
import axios from 'axios';


const CreatePullRequest = ({ parentFileId }) => {
    
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No accessToken in localStorage');
    return;
  }
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('message', message);

    try {
        const response = await fetch(`http://125.250.17.196:1234/api/files/${parentFileId}`, 
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData

    });
      // 업로드 성공 시 처리 로직 추가
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      // 업로드 실패 시 처리 로직 추가
    }
  };

  return (
    <div>
      <h1>새로운 버전의 파일 업로드</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">업로드</button>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePullRequest;