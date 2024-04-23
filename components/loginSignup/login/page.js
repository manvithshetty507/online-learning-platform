'use client';
import React, { useContext, useState } from 'react';
import styles from '@/styles/login.module.css';
import AuthContext from '@/context/AuthContext';
import Header from '@/components/header/page.js';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Login = ({ switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  const { handleLoginWithEmail, handleLoginWithGoogle } = useContext(AuthContext);
  
  const login = async () => {
    try {
      const user = await handleLoginWithEmail(email, password);
      
      if (user) {
        toast.success("logging in");
        router.push('/dashboard');
      }else {
        toast.error("user not found")
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  
    setEmail('');
    setPassword('');
  };

  return (
    <>
    <Header />
    <div className={styles.container}>
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={styles.input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className={styles.input}
      />
      <button onClick={() => login(router)} className={styles.button}> {/* Pass router to login */}
        Login with Email
      </button>
      {/* <button onClick={handleLoginWithGoogle} className={styles.button}>
        Login with Google
      </button> */}
      <p>
        Don't have an account?{' '}
        <button className={styles.linkButton} onClick={switchToSignUp}>
          Sign Up
        </button>
      </p>
    </div>
    </>
  );
};

export default Login;
