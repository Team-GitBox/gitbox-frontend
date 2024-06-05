import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PullRequest = () => {
  const { fileId } = useParams();
  const [fileData, setFileData] = useState(null);
  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(`http://125.250.17.196:1234/api/files/${fileId}/pr`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          },
        });
        setFileData(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFileData();
  }, [fileId]);

  if (!fileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{fileData.title}</h1>
      <p>{fileData.message}</p>
      <p>작성자: {fileData.writer}</p>
      <a href={fileData.fileUrl}>파일 다운로드</a>
      <h2>Comments:</h2>
      {fileData.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.comment}</p>
          <p>리뷰어: {comment.reviewerId}</p>
          <p>승인 여부: {comment.isApproved ? '승인' : '미승인'}</p>
          <p>작성일: {comment.createdAt}</p>
          <p>수정일: {comment.updatedAt}</p>
        </div>
      ))}
    </div>
  );
};

export default PullRequest;