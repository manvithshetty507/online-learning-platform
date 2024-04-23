'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import styles from '@/styles/watchcourse.module.css'
import { useAuthState } from 'react-firebase-hooks/auth';

function WatchCourse() {
    const { courseId } = useParams()
    const [user] = useAuthState(auth)
    const [course, setCourse] = useState(null);
    const [watchedChapters, setWatchedChapters] = useState([]);

    useEffect(() => {
      const fetchCourseDetails = async () => {
          try {
              // Get course details
              const courseDoc = await getDoc(doc(db, 'courses', courseId));
              if (courseDoc.exists()) {
                  const courseData = courseDoc.data();
                  // Set course data
                  setCourse(courseData);
              } else {
                  console.log('Course not found');
              }
          } catch (error) {
              console.error('Error fetching course:', error);
          }
      };

      const fetchWatchedChapters = async () => {
        try {
            if (!user) {
                console.log('User not authenticated');
                return;
            }
    
            const progressDocRef = doc(db, 'progress', `${courseId}_${user.uid}`);
            const progressDoc = await getDoc(progressDocRef);
    
            if (progressDoc.exists()) {
                const watchedChaptersData = progressDoc.data().chapters || {};
                const watchedChaptersTitles = Object.keys(watchedChaptersData);
                setWatchedChapters(watchedChaptersTitles);
                console.log("watched", watchedChapters)
            }
        } catch (error) {
            console.error('Error fetching watched chapters:', error);
        }
    };
  
    fetchWatchedChapters();
    fetchCourseDetails();
  }, [courseId, user]);

  const handleWatchVideo = async (chapter) => {
    // Implement function to handle video playback
    console.log('Watch video for chapter:', chapter.videoURL);
    // Update progress when a video is watched
    try {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        // Get the progress document for the current user and course
        const progressDocRef = doc(db, 'progress', `${courseId}_${user.uid}`);
        const progressDoc = await getDoc(progressDocRef);

        // If progress document exists, update it
        if (progressDoc.exists()) {
            await updateDoc(progressDocRef, {
                [`chapters.${chapter.title}`]: true, // Using chapter title for progress
            });
        } else {
            // If progress document doesn't exist, create it
            await setDoc(progressDocRef, {
                courseId,
                userId: user.uid,
                chapters: {
                    [chapter.title]: true,
                },
            });
        }
        console.log('Progress updated successfully');
    } catch (error) {
        console.error('Error updating progress:', error);
    }

    // Open the video in a new tab
    window.open(chapter.videoURL, '_blank');
};


  return (
    <div className={styles.container}>
      <h1 className={styles.courseTitle}>Watch Course</h1>
      {course && (
        <div>
          <h2 className={styles.courseTitle}>{course.title}</h2>
          <p className={styles.instructor}>Instructor email: {course.email}</p>
          <div>
            {/* Render the HTML content */}
            <p className={styles.description}><h3>Description:</h3> <span dangerouslySetInnerHTML={{ __html: course.description }} /></p>
          </div>
          <h3>Chapters:</h3>
          <ul className={styles.chapterList}>
            {course.chapters.map((chapter, index) => (
              <li key={index} className={styles.chapterItem}>
                <div>
                  <h4 className={styles.chapterTitle}>{chapter.title}</h4>
                  <button
                    onClick={() => handleWatchVideo(chapter)}
                    className={styles.videoButton}
                  >
                    Watch Video
                  </button>
                  
                  {watchedChapters.includes(chapter.title) && <span className={styles.watchedTag}>Watched</span>}
                </div>
              </li>
            ))}
          </ul>

          {/* Display previously added resources */}
        <div className={styles.resourceList}>
          <h3>Resources:</h3>
          <ul>
            {course?.resources?.map((resource, index) => (
              <li key={index} className={styles.resourceItem}>
                <a href={resource.url} className={styles.resourceLink}>{resource.name}</a>
              </li>
            ))}
          </ul>
        </div>
        </div>
      )}
    </div>
  )
}

export default WatchCourse