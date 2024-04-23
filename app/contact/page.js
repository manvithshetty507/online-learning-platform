import '@/styles/global.css'

const ContactUsPage = () => {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Contact Us</h1>
        <p style={styles.description}>
          Have questions or feedback? Feel free to reach out to us using the contact information below.
        </p>
        <div style={styles.contactInfo}>
          <p>Email: example@example.com</p>
          <p>Phone: +1234567890</p>
          <p>Address: 123 Street, City, Country</p>
        </div>
      </div>
    );
  };
  
  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center', // Center children horizontally
      backgroundColor: '#333',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box',
    },
    heading: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#fff',
    },
    description: {
      fontSize: '18px',
      lineHeight: '1.6',
      color: '#ccc',
      marginBottom: '20px',
    },
    contactInfo: {
      textAlign: 'left', // Align contact information to the left
    },
  };
  
  export default ContactUsPage;
  