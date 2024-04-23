'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/header.module.css';
import Link from 'next/link';
import logo from '@/assets/logo.jpg'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth)
  const router = useRouter()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the current user
      console.log('User logged out successfully');
      router.push('/')
    }catch(err) {
      console.log('unable to logout');
    }
    setMenuOpen(false) 
  }
  

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src={logo} alt="Logo" width={50} height={50} />
        <h1>Online Learning Platform</h1>
      </div>
      <nav className={styles.navLinks}>
        <div className={styles.kebabMenu} onClick={toggleMenu}>
          {menuOpen ? <>&times;</> : <>&#9776;</>}
        </div>
        <ul className={`${styles.menuItems} ${menuOpen && styles.open}`}>
          <li onClick={() => setMenuOpen(false)}>
            <Link href="/">Home</Link>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <Link href="/about">About Us</Link>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <Link href="/contact">Contact Us</Link>
          </li>
          {user &&
            <li onClick={handleLogout}>
              <button className={styles.logoutButton}>Logout</button>
            </li>
          }
        </ul>
      </nav>
    </header>
  );
}

export default Header;