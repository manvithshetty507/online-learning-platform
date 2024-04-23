import React from 'react'
import styles from '@/styles/dash.module.css'
import { useRouter } from 'next/navigation'

function CourseCard({ title, instructor, progress, thumbnail, enrolled, onEnroll, onStart, id, fullname }) {
  const router = useRouter()
  
  const onEdit = () => {
    router.push(`/editCourse/${id}`)
  }

  return (
    <div className={styles.courseCard}>
      {/* <img src={thumbnail} alt="Course Thumbnail" /> */}
      <h3>{title}</h3>
      <p className={styles.para}>By: {fullname}</p>
      <p>{progress && `Progress: ${progress}%`}</p>
      {!instructor && 
        <>
          {(enrolled) ? (
          <button onClick={onStart}>Start</button>
        ) : (
          <button onClick={onEnroll}>Enroll</button>
        )}
        </>
      }
      {instructor && 
        <button onClick={onEdit}>Edit</button>
      }
    </div>
  );
}

export default CourseCard;
