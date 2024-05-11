import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './logo.png';

const Login = () => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크
  const [username, setUsername] = useState('');


  const navigate = useNavigate();

  const handleLogin = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    
    const response = await fetch(
      "로그인 서버 주소",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const result = await response.json();
    // const result = {
    //   token: "tt",
    //   email: "ee@tt"
    // }

    if (response.status === 200) {
      setLoginCheck(false);
      // Store token in local storage
      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("email", result.email); // 여기서 userid를 저장합니다.
      console.log("로그인성공, 이메일주소:" + result.email);
      navigate("/"); // 로그인 성공시 홈으로 이동합니다.
    } else {
      setLoginCheck(true);
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
                  <p className="signup-link">
                  <Link to='/signup'>회원가입</Link>
                  </p>

              </div>
          </div>
      </div>
      
  );
};

export default Login;