'use client'
import React, { useState } from 'react';
import styles from '@/styles/addquiz.module.css'; // Import your CSS file
import { db } from '@/firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';

const AddQuiz = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: 0 }]);
    const [newQuestion, setNewQuestion] = useState('');
  
    const handleAddQuestion = () => {
        if (newQuestion.trim() !== '') {
            setQuestions([...questions, { question: newQuestion.trim(), options: ['', '', '', ''], answer: 0 }]);
            setNewQuestion('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await addDoc(collection(db, 'quizzes'), {
                title,
                questions,
            });
    
            setTitle('');
            setQuestions([{ question: '', options: ['', '', '', ''], answer: 0 }]);
            setNewQuestion('');
    
            console.log('Quiz added successfully!');
        } catch (error) {
            console.error('Error adding quiz:', error);
        }
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answer = optionIndex;
        setQuestions(updatedQuestions);
    };

    return (
        <div className={styles.addQuizContainer}>
            <h2>Add New Quiz</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Quiz Title:</label>
                    <input
                        type="text"
                        id="title"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                {questions.map((question, index) => (
                    <div key={index} className={styles.question}>
                        <div className={styles.formGroup}>
                            <label htmlFor={`question${index}`} className={styles.label}>Question {index + 1}:</label>
                            <input
                                type="text"
                                id={`question${index}`}
                                className={styles.input}
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                            />
                        </div>
                        <div className={styles.options}>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className={styles.option}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    />
                                    <label>
                                        <input
                                            type="radio"
                                            name={`answer${index}`}
                                            checked={question.answer === optionIndex}
                                            onChange={() => handleAnswerChange(index, optionIndex)}
                                        />
                                        Answer
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className={styles.formGroup}>
                    <label htmlFor="newQuestion" className={styles.label}>Add Question:</label>
                    <input
                        type="text"
                        id="newQuestion"
                        className={styles.input}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleAddQuestion} className={styles.addButton}>Add Question</button>
                <button type="submit" className={styles.submitButton}>Submit Quiz</button>
            </form>
        </div>
    );
};

export default AddQuiz;
