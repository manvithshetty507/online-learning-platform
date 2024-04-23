'use client'
import { createContext, useContext } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";


const AuthContext = createContext();

const handleLoginWithEmail = async (email, password) => {
    console.log("email&paass", email, password)
    //toast.success("Logging in")
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    return user
  } catch (err) {
    console.log(err.message);
  }
};


const handleLoginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.log(err.message);
  }
};

export const AuthContextProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{ handleLoginWithEmail, handleLoginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
