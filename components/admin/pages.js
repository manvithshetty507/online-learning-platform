'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/instructor.module.css';
// import NewQuizForm from '../NewQuizForm';
import CourseCard from '@/components/courseCard/page.js';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import Quizcard from '../quizCard/page';
import UserTable from '../userTable/page';

const Admin = () => {
    const [ user ] = useAuthState(auth)
    const [courses, setCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const router = useRouter()

    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')

    const addCourseClicked = () => {
        router.push('/addCourse')
    }

    const addQuizClicked = () => {
        router.push('/addQuiz')
    }

    useEffect(() => {
        const fetchCourses = async () => {
          const coursesCollection = collection(db, 'courses');
          let coursesSnapshot
          if (user?.role === 'instructor') {
            // If the user is an instructor, fetch only courses where the instructor's email matches
            const instructorCoursesQuery = query(coursesCollection, where('instructorEmail', '==', user.email));
            coursesSnapshot = await getDocs(instructorCoursesQuery);
          } else {
              // If the user is not an instructor, fetch all courses
              coursesSnapshot = await getDocs(coursesCollection);
          }
    
          const coursesData = [];
        
          for (const doc of coursesSnapshot.docs) {
            const courseData = doc.data();
            const courseId = doc.id;
        
            // Check if the current user is enrolled in this course
            const enrolledRef = collection(doc.ref, 'enrolled');
            const studentQuery = query(enrolledRef, where('email', '==', user?.email));
            const studentQuerySnapshot = await getDocs(studentQuery);
            const enrolled = !studentQuerySnapshot.empty;
        
            // Append the enrolled status to the course data
            coursesData.push({ id: courseId, ...courseData, enrolled });
          }
        
          setCourses(coursesData);
          setFilteredCourses(coursesData)
        };

        const fetchQuizzes = async () => {
            const quizzesCollection = collection(db, 'quizzes');
            const quizzesSnapshot = await getDocs(quizzesCollection);
            const quizzesData = [];
      
            for (const curDoc of quizzesSnapshot.docs) {
                const quizData = curDoc.data();
                const quizId = curDoc.id;
      
                // Check if the quiz has been attempted
                const quizRef = doc(db, 'quizzes', quizId);
                const quizDoc = await getDoc(quizRef);
                const attempted = quizDoc.exists && quizDoc.data().attempted;
                const score = quizDoc.exists && quizDoc.data().score;
      
                quizzesData.push({ id: quizId, ...quizData, attempted, score });
            }
      
            setQuizzes(quizzesData);
        };
      
    
    
        fetchCourses();
        fetchQuizzes();
      }, [user]);

      const handleSearch = (e) => {
        console.log("search", searchTerm)
        const filtered = courses.filter((course) => course.title.toLowerCase().includes(searchTerm));
        setFilteredCourses(filtered);
      };
    
  return (
    <div className={styles.instructorContainer}>
            {/* Navigation Sidebar */}
            <div className={styles.sidebar}>
                {/* Sidebar Navigation Links */}
                <ul className={styles.navLinks}>
                    <li><h4>Dashboard Home</h4></li>
                    <li><a href="#">My Courses</a></li>
                    <li><a href="#">Create New Quiz</a></li>
                    <li><a href="#">Manage Quizzes</a></li>
                    <li><a href="#">Settings</a></li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {/* Search Bar */}
                <div className={styles.searchBar}>
                    <input type="text" 
                        placeholder="Search for courses"
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" onClick={handleSearch}>Search</button>
                </div>

                {/* Course Cards */}
                <div className={styles.courseCards}>
                    {filteredCourses.map(course => (
                        <CourseCard
                        key={course.id}
                        title={course.title}
                        instructor={true}
                        progress={course.progress}
                        fullname={course.email}
                        id={course.id}
                        />
                    ))}
                </div>

                <div className={styles.quizCards}>
                {quizzes.map((quiz) => (
                    <Quizcard
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    creator={quiz.creator} // Adjust the property names as per your database structure
                    admin={true}
                    />
                ))}
                </div>

                {/* Add New Course Button */}
                <div className={styles.addCourseButton}>
                    <button onClick={addCourseClicked}>Add New Course</button>
                </div>

                <div className={styles.addQuizButton}>
                    <button onClick={addQuizClicked}>Add New Quiz</button>
                </div>

                <UserTable />
            </div>

        </div>
  )
}

export default Admin