import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PullRequest = () => {
  const { pullRequestId } = useParams();
  const [fileData, setFileData] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isApproved, setIsApproved] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(`http://125.250.17.196:1234/api/pull-request/${pullRequestId}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          },
        });
        const data = await response.json(); 
        setFileData(data.data); 
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://125.250.17.196:1234/api/my/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFileData();
    fetchUserInfo();
  }, [pullRequestId, token]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleApproval = (approved) => {
    setIsApproved(approved);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://125.250.17.196:1234/api/pull-request/${pullRequestId}/comments`, {
        comment: newComment,
        isApproved
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNewComment('');
      setIsApproved(null);
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!fileData || !userInfo) {
    return <div>Loading...</div>;
  }

  const handlebackbtn = () => {
    navigate(-1);
  }

  return (
    <div>
      <button className='back-page-btn' onClick={() => handlebackbtn()}>뒤로 가기</button> 
      <h1>{fileData.title}</h1>
      <p>{fileData.message}</p>
      <p>작성자: {fileData.writer}</p>
      <a href={fileData.fileUrl}>파일 다운로드</a>
      {fileData.comments.length > 0 && (
      <div>
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
    )}
      {fileData.writer !== userInfo.email && (
        <div>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="메시지 남기기"
          />
          <button onClick={() => handleApproval(true)}>수락</button>
          <button onClick={() => handleApproval(false)}>거절</button>
          <button onClick={handleSubmit}>전송</button>
        </div>
      )}
    </div>
  );
};

export default PullRequest;
