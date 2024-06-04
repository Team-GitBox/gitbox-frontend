import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './logo.png';





const Login = () => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState('');
  const [loginCheck, setLoginCheck] = useState(false);

  const navigate = useNavigate();



  const handleLogin = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    
    const response = await fetch(
      "http://125.250.17.196:1234/api/login",
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
 
    if ( response.status ===  200) {
    
      setLoginCheck(false);
      // Store token in local storage
      localStorage.setItem("accessToken", result.data.accessToken);
      console.log("토큰", localStorage);
      navigate("/file"); // 로그인 성공시 홈으로 이동합니다.
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
                      placeholder="이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button onClick={handleLogin}>로그인</button>
                  
                  <p className="signup-link">
                  <Link to='/signup'>회원 가입</Link>
                  </p>

              </div>
          </div>
      </div>
      
  );
};

export default Login;