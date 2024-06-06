import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePullRequest = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('accessToken');
  const { parentFileId } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

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
    formData.append('request', JSON.stringify({
        pullRequestTitle: title,
        pullRequestMessage: message,
      }));

    try {
      const response = await axios.post(`http://125.250.17.196:1234/api/files/${parentFileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      navigate(-1);
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

        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" value={message} onChange={handleMessageChange} />
        </div>
        <button type="submit">Pull Request 전송</button>
      </form>
    </div>
  );
};

export default CreatePullRequest;