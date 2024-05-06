"use client"
import { useState,useEffect } from "react"
import { Input } from "@nextui-org/react";
import './globals.css'; 

export default function LoginPage() {
  // State variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    try {
      console.log("username: ", username);
      // Send POST request to backend API with username and password
      const response = await fetch('http://localhost:4000/account/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Handle response
      if (response.ok) {
        // Login successful
        const data = await response.json();
        console.log(data);
      } else {
        // Login failed
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error);
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <h1 className="login-title">Login</h1>
        <div className="input-container">
          <label className="input-label" htmlFor="username">Username</label>
          <Input
            id="username"
            isRequired
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on change
            placeholder='Username'
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">Password</label>
          <Input
            id="password"
            isRequired
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            placeholder='Enter your password'
            className="input-field"
          />
        </div>
        <button type="button" className="submit-button" onClick={handleLogin}>Login</button>
      </main>
      <div className='RegNFor'>
        <div className='Forget'>
          <a href="/forget-password">Forget Password?</a>
        </div>
        <div className='Register'>
          <a href="/register">First Time ? ... Register</a>   
        </div>
      </div>
    </div>
  );
}