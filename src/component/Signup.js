import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    // 회원가입 처리 로직을 구현합니다.

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  

    // Create payload
    const payload = {
      email: email,
      password: password,  
      name: username,
    };
  
    

    try {
      const response = await fetch(
        "요청지 주소",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        // Redirect to login.html
        console.log("성공! 이메일주소: " + data.email);
        setUsername("");
        setPassword("");
        setEmail("");

        // 로그인 성공시 홈으로 이동합니다.
      } else if (response.status === 400) {
        // Handle error
        alert(`회원가입 실패: ${data.email}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignup}>
          <h1>회원가입</h1>

          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p></p>

          <label htmlFor="username">사용자명</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p></p>

          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p></p>

          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p></p>


          <button id="signup-button" onClick={handleSignup}>
            회원가입
          </button>
          


          <p className="login-link">
            이미 회원이신가요? <Link to="/">로그인</Link>
          </p>

        </form>
      
    </div>
  );
};

export default Signup;
