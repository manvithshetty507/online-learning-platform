import React from 'react';
import styles from '@/styles/footer.module.css';
import Image from 'next/image';
import fbLogo from '@/assets/fb-icon.png'
import instaLogo from '@/assets/insta-icon.png'
import tLogo from '@/assets/twit-icon.png'

function Footer() {
    return (
        <footer className={styles.footer}> {/* Apply external styles */}
            <div className={styles.socialLinks}> {/* Apply external styles */}
                <Image src={fbLogo} alt="Facebook" width={32} height={32} /> {/* Example social logo */}
                <Image src={tLogo} alt="Twitter" width={32} height={32} /> {/* Example social logo */}
                <Image src={instaLogo} alt="Instagram" width={32} height={32} /> {/* Example social logo */}
                {/* Add more social logos as needed */}
            </div>
            <div className={styles.info}> {/* Apply external styles */}
                <p>© 2024 Online Learning Platform. All rights reserved.</p>
                <p>Contact: info@example.com</p>
            </div>
        </footer>
    );
}

export default Footer;
