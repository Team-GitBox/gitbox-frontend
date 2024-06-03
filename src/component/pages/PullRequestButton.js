import React, { useState } from 'react';
import styled from 'styled-components';
import { Popup } from './Popup';

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const PullRequestButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState({
    title: '풀 리퀘스트 제목',
    writer: '작성자 이름',
    message: '여기에 작성자 메시지가 들어갑니다.',
    comments: [
      { id: 1, reviewerId: '리뷰어1', comment: '좋은 코드입니다!' },
      { id: 2, reviewerId: '리뷰어2', comment: '몇 가지 수정사항이 필요합니다.' }
    ]
  });

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <Button onClick={openPopup}>풀 리퀘스트 보기</Button>
      {isPopupOpen && <Popup data={data} onClose={closePopup} />}
    </div>
  );
};

export default PullRequestButton;