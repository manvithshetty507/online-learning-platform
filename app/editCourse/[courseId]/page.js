'use client'
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '@/firebase/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { getDownloadURL, ref, uploadBytes, deleteObject, listAll } from 'firebase/storage';
import styles from '@/styles/editcourse.module.css';

function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
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

    const fetchEnrolledStudents = async () => {
      try {
        // Fetch enrolled students
        const enrolledRef = collection(doc(db, 'courses', courseId), 'enrolled');
        const enrolledSnapshot = await getDocs(enrolledRef);
        const students = enrolledSnapshot.docs.map(doc => doc.data());
        // Set enrolled students
        setEnrolledStudents(students);
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
      }
    };

    fetchCourseDetails();
    fetchEnrolledStudents();
  }, [courseId]);

  const handleEditChapter = async (chapterIndex, updatedChapterData) => {
    try {
      // Update the chapter data in the course document
      const updatedCourseChapters = [...course.chapters];
      updatedCourseChapters[chapterIndex] = updatedChapterData;
      await updateDoc(doc(db, 'courses', courseId), { chapters: updatedCourseChapters });
      // Update the local state to reflect the changes
      setCourse({ ...course, chapters: updatedCourseChapters });
      console.log('Chapter updated successfully');
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleUpdateChapterName = (chapterIndex, newName) => {
    const updatedChapter = { ...course.chapters[chapterIndex], title: newName };
    handleEditChapter(chapterIndex, updatedChapter);
  };

  const handleReplaceVideo = async (chapterIndex, file) => {
    try {
      // Upload the new video to Firebase Storage
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const newVideoUrl = await getDownloadURL(storageRef);
  
      // Update the videoUrl in the chapter data
      const updatedChapter = { ...course.chapters[chapterIndex], videoURL: newVideoUrl };
  
      // Update the chapter data in the database
      await handleEditChapter(chapterIndex, updatedChapter);
  
      console.log('Video replaced successfully');
    } catch (error) {
      console.error('Error replacing video:', error);
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      // Upload changed videos
      const uploadTasks = course.chapters.map(async (chapter) => {
        if (chapter.video) {
          // Upload new video
          // For simplicity, let's assume this logic is similar to the one in handleChapterUpload function in AddCourse component
          // You can refactor it to a separate function and reuse it here
          console.log('Uploading video:', chapter.video.name);
        }
        return chapter;
      });

      // Wait for all upload tasks to complete
      const updatedChapters = await Promise.all(uploadTasks);

      // Update course fields
      await updateDoc(doc(db, 'courses', courseId), { chapters: updatedChapters });
      console.log('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteChapter = async (chapterIndex) => {
    try {
      const updatedCourseChapters = [...course.chapters];
      updatedCourseChapters.splice(chapterIndex, 1);
      await updateDoc(doc(db, 'courses', courseId), { chapters: updatedCourseChapters });
      setCourse({ ...course, chapters: updatedCourseChapters });
      console.log('Chapter deleted successfully');
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      // Delete the course document from Firestore
      await deleteDoc(doc(db, 'courses', courseId));
      // Delete any associated data, such as videos in storage
      // For simplicity, let's assume all videos are stored in a folder named 'videos'
      // You might need to adjust this logic based on your actual storage structure
      const videosRef = ref(storage, 'videos');
      const listResult = await listAll(videosRef);
      const deleteTasks = listResult.items.map(async (item) => {
        await deleteObject(item);
      });
      await Promise.all(deleteTasks);
      console.log('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleAddResource = async () => {
    try {
      if (!selectedResource) {
        console.error('No resource selected.');
        return;
      }
  
      // Upload the selected PDF resource to Firebase Storage
      const storageRef = ref(storage, `resources/${selectedResource.name}`);
      await uploadBytes(storageRef, selectedResource);
      const resourceUrl = await getDownloadURL(storageRef);

      // Initialize course.resources as an empty array if it's not initialized
      const resources = course.resources || [];

      // Add the new resource to the resources array
      const updatedResources = [...resources, { name: selectedResource.name, url: resourceUrl }];

      // Update the course data to include the new resource
      await updateDoc(doc(db, 'courses', courseId), { resources: updatedResources });
  
      // Update the local state to reflect the changes
      setCourse({ ...course, resources: updatedResources });
  
      console.log('Resource added successfully');
  
      // Clear the selected resource
      setSelectedResource(null);
    } catch (error) {
      console.error('Error adding resource:', error);
    }
};

  const handleDeleteResource = async (index) => {
    try {
      // Remove the resource from the course data
      const updatedResources = [...course.resources];
      updatedResources.splice(index, 1);
  
      // Update the course document in Firestore to remove the resource
      await updateDoc(doc(db, 'courses', courseId), { resources: updatedResources });
  
      // Update the local state to reflect the changes
      setCourse({ ...course, resources: updatedResources });
  
      console.log('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit</h1>
      {course && (
        <div>
          <h2>{course.title}</h2>
          <p className={styles.instructor}>Instructor: {course.email}</p>
          <h3>Chapters:</h3>
          <ul>
            {course.chapters.map((chapter, index) => (
              <li key={index} className={styles.chapter}>
                <h4>{chapter.title}</h4>
                <div>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      const newName = prompt('Enter new chapter name:');
                      if (newName) {
                        handleEditChapter(index, { ...chapter, title: newName });
                      }
                    }}
                  >
                    Update Chapter Name
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'video/*';
                      fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleReplaceVideo(index, file);
                        }
                      };
                      fileInput.click();
                    }}
                  >
                    Replace Video
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteChapter(index)}
                  >
                    Delete Chapter
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className={`${styles.editButton} ${styles.saveButton}`} onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className={`${styles.editButton} ${styles.deleteButton}`} onClick={handleDeleteCourse}>
            Delete Course
          </button>

         {/* Display previously added resources */}
        <div className={styles.resourceList}>
          <h3>Resources:</h3>
          <ul>
            {course?.resources?.map((resource, index) => (
              <li key={index} className={styles.resourceItem}>
                <a href={resource.url} className={styles.resourceLink}>{resource.name}</a>
                <button onClick={() => handleDeleteResource(index)} className={styles.deleteButton}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add resource input */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedResource(e.target.files[0])}
        />
        <button onClick={handleAddResource} className={styles.addResourceButton}>Add Resource</button>
        </div>
      )}

      {/* Display enrolled students */}
      <div className={`${styles.enrolledStudents} ${styles.enrolledStudentsContainer}`}>
        <h3 className={styles.enrolledStudentsHeading}>Enrolled Students:</h3>
        <ul className={styles.enrolledStudentsList}>
          {enrolledStudents.map((student, index) => (
            <li key={index} className={styles.enrolledStudent}>{student.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditCourse;
