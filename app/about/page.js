import React from 'react';
import '@/styles/global.css'

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About Us</h1>
      <p style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer auctor velit vitae massa vehicula, et viverra mi ultricies. Nam nec justo sed ipsum hendrerit consequat. Vivamus maximus euismod neque, eget ultricies felis rhoncus ac. Donec posuere sollicitudin nisi, in vestibulum lacus. Morbi maximus consectetur ligula non mattis. Ut nec placerat diam. Nam ultrices, arcu non vestibulum faucibus, mauris sapien suscipit urna, et pharetra libero est eget leo. Vivamus vehicula, lorem ac molestie rhoncus, ligula sem varius nunc, vel vulputate nisl ex vel ipsum.
      </p>
    </div>
  );
};

const styles = {
    container: {
      width: '100%', // Set width to 100vw
      minHeight: '100vh', // Set height to 100vh
      display: 'flex', // Make the container a flex container
      flexDirection: 'column', // Align children vertically
      justifyContent: 'center', // Center children horizontally and vertically
      backgroundColor: '#333', // Dark background color
      color: '#fff', // Light text color
      padding: '20px',
      boxSizing: 'border-box', // Include padding in the width and height
    },
    heading: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#fff', // Light heading text color
      textAlign:'center'
    },
    description: {
      fontSize: '18px',
      lineHeight: '1.6',
      color: '#ccc', // Light description text color
    },
  };
  
  
export default AboutPage;
