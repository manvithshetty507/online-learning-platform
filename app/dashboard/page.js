'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/header/page'
import Footer from '@/components/footer/page'
import '@/styles/global.css'
import Student from '@/components/student/page'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/firebase'
import { toast } from 'react-toastify'
import { doc, getDoc } from 'firebase/firestore'
import Instructor from '@/components/instructor/pages'
import Admin from '@/components/admin/pages'



const Dashboard = () => {

  const [user] = useAuthState(auth)
  const [currentUser, setCurrentuser] = useState('')

  useEffect(() => {
    if (user) {
      const getUserDoc = async () => {
        try {
          const userRef = doc(db, 'users', user?.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log('User Data:', userData);
            // Do something with the user data
            setCurrentuser(userData)
          } else {
            console.log('User document does not exist');
          }
        } catch (err) {
          toast.error(err.message);
        }
      };

      getUserDoc();
    }
  }, [user]);

  return (
    <>
    <Header />
      {currentUser?.role?.toLowerCase() === 'student' && <Student currentUser={currentUser}/>}
      {currentUser?.role?.toLowerCase() === 'instructor' && <Instructor />}
      {currentUser?.role?.toLowerCase() === 'admin' && <Admin />}
    <Footer />
    </>
  )
}

export default Dashboard