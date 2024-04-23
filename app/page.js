'use client'
import React, { useEffect } from 'react'
import '@/styles/global.css'
import { AuthContextProvider } from '@/context/AuthContext'
import Header from '@/components/header/page'
import styles from '@/styles/page.module.css'
import Link from 'next/link'
import Footer from '@/components/footer/page'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase'
import { useRouter } from 'next/navigation'

function Home() {

    const [user] = useAuthState(auth)
    const router = useRouter()

    useEffect(() => {
        
        if(user) {
            console.log("user",user)
            router.push('/dashboard')
        }
    },[user])

  return (
    <AuthContextProvider>
        <div className={styles.page}>
                <Header />
                <div className={styles.containerWrapper}>
                    <div className={styles.container}>
                        <h1>Welcome to Your Learning Platform</h1>
                        <p>Discover a world of knowledge at your fingertips.</p>
                        <div className={styles.buttons}>
                            <Link href="/auth">
                                Wanted to Join the Journey...
                            </Link>
                        </div>
                        <p>Explore a wealth of courses to enrich your learning journey and expand your knowledge!</p>
                    </div>
                </div>
                <Footer />
            </div>
    </AuthContextProvider>
  )
}

export default Home