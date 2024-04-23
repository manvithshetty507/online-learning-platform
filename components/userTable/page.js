import React, { useEffect, useState } from 'react';
import styles from '@/styles/instructor.module.css';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';

const UserTable = () => {
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const instructorsCollection = query(collection(db, 'users'), where('role', '==', 'instructor'));
      const studentsCollection = query(collection(db, 'users'), where('role', '==', 'student'));

      const instructorsSnapshot = await getDocs(instructorsCollection);
      const studentsSnapshot = await getDocs(studentsCollection);

      const instructorsData = instructorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const studentsData = studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


      setInstructors(instructorsData);
      setStudents(studentsData);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
        await deleteDoc(doc(db, 'users', userId));
        await auth().deleteUser(userId);
        console.log('User deleted successfully');
        // Refresh the user list after deletion
        // You may also remove the deleted user from the state directly
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

  return (
    <div>
        <h2 className={styles.sectionTitle}>Instructors</h2>
        <div className={styles.tableContainer}>
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                {/* Add more columns as needed */}
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {instructors.map(instructor => (
                <tr key={instructor.id}>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    <td>
                    <button onClick={() => handleDeleteUser(instructor.id)} className={styles.deleteButton}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                        >
                        <path
                            fillRule="evenodd"
                            d="M3.5 5.5A.5.5 0 0 1 4 5h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8zm1-1a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 12 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 3 12.5v-8z"
                        />
                        </svg>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <h2 className={styles.sectionTitle}>Students</h2>
        <div className={styles.tableContainer}>
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                {/* Add more columns as needed */}
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                <tr key={student.id}>
                    <td>{student.name} </td>
                    <td>{student.email}</td>
                    <td>
                    <button onClick={() => handleDeleteUser(student.id)} className={styles.deleteButton}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                        >
                        <path
                            fillRule="evenodd"
                            d="M3.5 5.5A.5.5 0 0 1 4 5h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8zm1-1a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 12 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 3 12.5v-8z"
                        />
                        </svg>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
  );
};

export default UserTable;
