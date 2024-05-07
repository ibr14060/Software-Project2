// pages/verify-email.js
"use client";
import React from "react";
import {Button} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

console.log("token: ", token);
 
const handleSignUp = async () => {
    try {
          const response = await fetch('http://localhost:4000/account/confirmsign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      // Handle response
      if (response.ok) {
        // Login successful
        const data = await response.json();
        console.log(data);
        const token = data.token;
        console.log(token);
        const encodedToken = encodeURIComponent(token);

      } else {
        // Login failed
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error);
    }
  };


  return (
    <div className='b'>
     <div className="verify">

     <p>Click the button below to verify your email</p>
     <Button color="success" className="buttonsuccess" onClick={handleSignUp}>
        Success
     </Button> 
     </div> 

    </div>
  );
}
