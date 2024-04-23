'use client'
import React, { useState } from 'react'
import Login from '@/components/loginSignup/login/page.js';
import SignUp from '@/components/loginSignup/signup/page.js';
import styles from '@/styles/auth.module.css'
import '@/styles/global.css'
import { AuthContextProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  const switchToSignUp = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <AuthContextProvider>
    <>
      <ToastContainer />
        <main className={styles.auth_container}>
            {isLogin ? <Login switchToSignUp={switchToSignUp} /> : <SignUp switchToLogin={switchToLogin} />}
        </main>
    </>
    </AuthContextProvider>
  )
}

export default Auth