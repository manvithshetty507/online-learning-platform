// components/loginSignup/signup/page.js
'use client'
import React from 'react';
import { useState } from 'react';
import styles from '@/styles/signup.module.css'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import Header from '@/components/header/page.js';
import 'react-toastify/dist/ReactToastify.css';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SignUp = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [role, setRole] = useState()
  const router = useRouter()

  const handleSignUpWithEmail = async () => {
    console.log("email", email);
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        if (user) {
            const userRef = doc(db, 'users', user?.uid);
            const newUser = {
                name,
                email: user.email,
                role,
            };
            await setDoc(userRef, newUser);
            toast.success("User saved");
            router.push('/dashboard')
        } else {
            toast.error("Failed to create this email");
        }
    } catch (err) {
        toast.error(err.message);
        console.error(err);
    }
};


  const handleSignUpWithGoogle = async () => {
    // try {
    //   await signInWithGoogle();
    // } catch (error) {
    //   console.error('Error signing up with Google:', error);
    // }
  };

  return (
    <>
    <Header />
    <div className={styles.container}>
      <h1>Sign Up</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className={styles.input}
      />

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className={styles.input}
      >
        <option value="">Please select</option>
        <option value="admin">Admin</option>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>

      <button onClick={handleSignUpWithEmail} className={styles.button}>
        Sign Up with Email
      </button>
      {/* <button onClick={handleSignUpWithGoogle} className={styles.button}>
        Sign Up with Google
      </button> */}
      <p>
        Already have an account?{' '}
        <button className={styles.linkButton} onClick={switchToLogin}>
          Login
        </button>
      </p>
    </div>
    </>
  );
};

export default SignUp;
