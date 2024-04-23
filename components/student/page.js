'use client'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/student.module.css'
import CourseCard from '../courseCard/page'
import Quizcard from '../quizCard/page'
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const Student = () => {

  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [ user ] = useAuthState(auth)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all');


  const fetchCourses = async () => {
    const coursesCollection = collection(db, 'courses');
    let coursesSnapshot
    if (user?.role === 'instructor') {
      // If the user is an instructor, fetch only courses where the instructor's email matches
      const instructorCoursesQuery = query(coursesCollection, where('email', '==', user.email));
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
    setFilteredCourses(coursesData);
  };

  useEffect(() => {
    
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

  const enrollCourse = async (courseId, studentEmail) => {
    // Check if the student is already enrolled
    const courseRef = doc(db, 'courses', courseId);
    const enrolledRef = collection(courseRef, 'enrolled');
    const studentQuery = query(enrolledRef, where('email', '==', studentEmail));
    const studentQuerySnapshot = await getDocs(studentQuery);

    if (studentQuerySnapshot.empty) {
      // If not enrolled, enroll the student
      await addDoc(enrolledRef, { email: studentEmail });
      // Update the UI to reflect enrollment
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return { ...course, enrolled: true };
        }
        return course;
      });
      setCourses(updatedCourses);
      await fetchCourses()
    } else {
      // If already enrolled, show a message or handle as needed
      console.log('Student already enrolled in this course.');
    }
  };

  const startCourse = async (courseId) => {
    // Handle starting the course
    console.log('Starting course:', courseId);
    router.push(`/watchCourse/${courseId}`)
  };

  const handleStartQuiz = async (quizId) => {
    try {
      // Fetch the attempts for the current quiz
      const attemptsRef = collection(db, 'quizzes', quizId, 'attempts');
      const attemptsQuery = query(attemptsRef, where('email', '==', user?.email));
      const attemptsSnapshot = await getDocs(attemptsQuery);
      let score;
      let total
      for(const quizDoc of attemptsSnapshot.docs) {
        const data = quizDoc.data()
        // console.log("score", data.correctAnswers)
        score = data.correctAnswers
        total = data.totalQuestions
      }
      // Check if the current user has attempted the quiz
      if (attemptsSnapshot.empty) {
          // If not attempted, navigate to the attemptQuiz page
          router.push(`/attemptQuiz/${quizId}`);
      } else {
          // If attempted, show a message
          alert(`Quiz already attempted your score is ${score}/${total}`);
      }
  } catch (error) {
      console.error('Error starting quiz:', error);
  }
};

const handleSearch = (e) => {
  console.log("search", searchTerm)
  const filtered = courses.filter((course) => course.title.toLowerCase().includes(searchTerm));
  setFilteredCourses(filtered);
};

const handleFilter = (e) => {
  const selectedFilter = e.target.value;
  setFilter(selectedFilter);

  if (selectedFilter === 'all') {
    setFilteredCourses(courses); // Reset to all courses
  } else if (selectedFilter === 'enrolled') {
    const enrolledCourses = courses.filter((course) => course.enrolled);
    setFilteredCourses(enrolledCourses);
  } else if (selectedFilter === 'unattempted') {
    const unattemptedCourses = courses.filter((course) => !course.enrolled);
    setFilteredCourses(unattemptedCourses);
  }
};
    
  return (
    <div className={styles.dashboardContainer}>
      {/* Navigation Sidebar */}
      <div className={styles.sidebar}>
        {/* Sidebar Navigation Links */}
        <ul className={styles.navLinks}>
          <li><h4>Dashboard Home</h4></li>
          <li><a href="#">My Courses</a></li>
          <li><a href="#">Enroll in New Course</a></li>
          <li><a href="#">Quizzes</a></li>
          <li><a href="#">Progress Tracker</a></li>
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
        {/* Filters */}
        <div className={styles.filters}>
          <label htmlFor="filter-select">Filter by:</label>
          <select id="filter-select" onChange={handleFilter}>
            <option value="all">All Courses</option>
            <option value="enrolled">Enrolled Courses</option>
            <option value="unattempted">Unattempted Courses</option>
          </select>
        </div>
        {/* Course Cards */}
        <h2 style={{margin:'10px'}}>Courses</h2>
        <div className={styles.courseCards}>
          {filteredCourses.map(course => (
            <CourseCard
            key={course.id}
            title={course.title}
            instructor={false}
            fullname={course.email}
            progress={course.progress}
            enrolled={course.enrolled}
            onEnroll={() => enrollCourse(course.id, user?.email)}
            onStart={() => startCourse(course.id)}
          />
          ))}
        </div>
        {/* Quiz Cards */}
        <h2 style={{margin:'10px'}}>Quizzes</h2>
        <div className={styles.quizCards}>
          {quizzes.map((quiz) => (
            <Quizcard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              creator={quiz.creator} // Adjust the property names as per your database structure
              status={quiz.status} // Adjust the property names as per your database structure
              attempted={quiz.attempted} // Pass attempted status
              score={quiz.score} // Pass score
              handleStart={handleStartQuiz}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Student