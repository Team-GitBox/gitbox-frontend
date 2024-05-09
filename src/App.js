// src/App.js

import React, { useState } from 'react';
import './App.css';
import logo from './logo.png'; // 이미지 파일 import

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 처리 함수
    if (username === 'admin' && password === 'admin123') {
      alert('로그인 성공!');
      // 여기에 로그인 성공 후의 처리를 추가할 수 있습니다.
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="App">
      <div className="center">
        <div className="login-container">
          <div className="logo-container">
            <img src={logo} alt="로고" className="logo" /> {/* 이미지 추가 */}
          </div>
          <h2>Git Box</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
}

export default App;
