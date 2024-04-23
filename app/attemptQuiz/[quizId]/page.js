'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Timestamp, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import styles from '@/styles/attemptquiz.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';

function QuizPage() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [user] = useAuthState(auth)
    const router = useRouter()

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
                if (quizDoc.exists()) {
                    const quizData = quizDoc.data();
                    setQuiz(quizData);
                } else {
                    console.log('Quiz not found');
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        quiz.questions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                correctCount++;
            }
        });
        setCorrectAnswers(correctCount);

        try {
            const quizAttemptRef = collection(doc(db, 'quizzes', quizId), 'attempts');
            await addDoc(quizAttemptRef, {
                email: user.email,
                correctAnswers: correctCount,
                totalQuestions: quiz.questions.length,
                timestamp: Timestamp.now(),
            });
            console.log('Quiz attempt added successfully');
        } catch (error) {
            console.error('Error adding quiz attempt:', error);
        }

        router.push('/dashboard')
    };

    return (
        <div className={styles.container}>
            {quiz && (
                <div>
                    <h2 className={styles.title}>{quiz.title}</h2>
                    {/* <p className={styles.creator}>Creator: {quiz.creator}</p> */}
                    {quiz.questions.map((question, index) => (
                        <div key={index} className={styles.question}>
                            <h3>Question {index + 1}</h3>
                            <p>{question.question}</p>
                            <ul className={styles.options}>
                                {question.options.map((option, optionIndex) => (
                                    <li key={optionIndex} className={styles.option}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                checked={userAnswers[index] === optionIndex}
                                                onChange={() => handleOptionSelect(index, optionIndex)}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
                    {correctAnswers > 0 && (
                        <p>Number of correct answers: {correctAnswers}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuizPage;
