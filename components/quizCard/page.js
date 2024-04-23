
import React from 'react'
import styles from '@/styles/dash.module.css'
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const Quizcard = ({ id, title, creator, status, handleStart, attempted, score, admin }) => {
  const handleClick = () => {
      handleStart(id);
  };

  const handleDelete = async () => {
    try {
        // Delete the document from Firestore using the provided ID
        await deleteDoc(doc(db, 'quizzes', id));
        console.log('Quiz deleted successfully');
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
  }

  return (
      <div className={styles.quizCard}>
          <h3 style={{margin:'5px 0'}}>{title}</h3>
          {/* <p>Creator: {creator}</p> */}
          {/* <p>Status: {status}</p> */}
          {admin ? (
                <button onClick={handleDelete} className={styles.editButton}>Delete Quiz</button>
            ) : (
                <>
                {!attempted ? (
                    <button onClick={handleClick} disabled={attempted} className={styles.startButton}>Start Quiz</button>
                ) : (
                    <p>Score: {score}</p>
                )}
                </>
            )}
      </div>
  );
};

export default Quizcard;