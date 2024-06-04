import React from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const WriterMessage = styled.div`
  margin-bottom: 20px;
`;

const Comment = styled.div`
  margin-bottom: 10px;
`;

export const Popup = ({ data, onClose }) => (
  <PopupContainer>
    <button onClick={onClose}>닫기</button>
    <Title>{data.title}</Title>
    <WriterMessage>
      <p>작성자: {data.writer}</p>
      <p>메시지: {data.message}</p>
    </WriterMessage>
    {data.comments.map((comment) => (
      <Comment key={comment.id}>
        <p>리뷰어 ID: {comment.reviewerId}</p>
        <p>코멘트: {comment.comment}</p>
      </Comment>
    ))}
  </PopupContainer>
);