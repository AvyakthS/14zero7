import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // Import useNavigate
import './Login.css'
import email from '../../../assets/email.png'
import password from '../../../assets/password.png'
import person from '../../../assets/person.png'

const LoginUser = () => {
  const [action, setAction] = useState("Login");
  const navigate = useNavigate();  // Initialize navigate

  // Handler for login button click
  const handleLoginClick = () => {
    if (action === "Login") {
      navigate('/homeUser');  // Navigate to /homeUsers when Login is clicked
    } else {
      setAction("Login");  // Switch to login tab if in Sign Up
    }
  };

  // Handler for sign up button click
  const handleSignUpClick = () => {
    setAction("Sign Up");  // Switch to Sign Up tab
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Sign Up" ? (
          <div className="input">
            <img src={person} alt="" />
            <input type="text" placeholder="Name" />
          </div>
        ) : (
          <div></div>
        )}
        <div className="input">
          <img src={email} alt="" />
          <input type="email" placeholder="email" />
        </div>
        <div className="input">
          <img src={password} alt="" />
          <input type="password" placeholder="password" />
        </div>
        {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className="forgot-password">
            Forgot Password? <span>Click here!</span>
          </div>
        )}
        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"} onClick={handleSignUpClick}>
            Sign Up
          </div>
          <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={handleLoginClick}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
