'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/addcourse.module.css';
import { db, storage } from '@/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import JoditEditor from 'jodit-react';

const AddCourse = () => {
    const [email, setEmail] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [chapters, setChapters] = useState([]);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);

    // Focus the editor when the description state changes
    useEffect(() => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.selection && editorRef.current.editor.selection.focus();
        }
    }, [description]);
    

    const handleChapterUpload = (e) => {
        // Handle chapter upload logic here
    };

    const handleAddChapter = () => {
        setChapters([...chapters, { title: '', video: null }]);
    };

    const handleRemoveChapter = (index) => {
        const updatedChapters = [...chapters];
        updatedChapters.splice(index, 1);
        setChapters(updatedChapters);
    };

    const handleChapterTitleChange = (index, value) => {
        const updatedChapters = [...chapters];
        updatedChapters[index].title = value;
        setChapters(updatedChapters);
    };

    const handleVideoUpload = (index, file) => {
        const updatedChapters = [...chapters];
        updatedChapters[index].video = file;
        setChapters(updatedChapters);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const uploadTasks = chapters.map(async (chapter, index) => {
                const file = chapter.video;
                const storageRef = ref(storage, `videos/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                return { title: chapter.title, videoURL: downloadURL };
            });

            const chapterDetails = await Promise.all(uploadTasks);

            await addDoc(collection(db, 'courses'), {
                email,
                title: courseTitle,
                chapters: chapterDetails,
                description: description, // Use editor value instead of ref value
            });

            setEmail('');
            setCourseTitle('');
            setChapters([]);

            console.log('Course details saved successfully!');
        } catch (error) {
            console.error('Error saving course details:', error);
        }
    };

    return (
        <div className={styles.addCourseContainer}>
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Instructor Email:</label>
                    <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="courseTitle" className={styles.label}>Course Title:</label>
                    <input type="text" id="courseTitle" className={styles.input} value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                </div>

                {/* Add JoditEditor for description */}
                <JoditEditor
                    value={description}
                    ref={editorRef}
                    onChange={(content) => setDescription(content)}
                    config={{
                        minHeight: 400,
                        showCharsCounter: false,
                        toolbarAdaptive: false,
                        toolbarButtonSize: 'large',
                        buttons: [
                            'bold',
                            'italic',
                            'underline',
                            '|',
                            'ul',
                            'ol',
                            '|',
                            'font',
                            'fontsize',
                            '|',
                            'align'
                        ],
                    }}
                    tabIndex={1} // Add tabIndex to enable focusing
                    className={styles.joditEditor}
                />

                {chapters.map((chapter, index) => (
                    <div key={index} className={styles.chapter}>
                        <div className={styles.formGroup}>
                            <label htmlFor={`chapterTitle${index}`} className={styles.label}>Chapter {index + 1} Title:</label>
                            <input type="text" id={`chapterTitle${index}`} className={styles.input} value={chapter.title} onChange={(e) => handleChapterTitleChange(index, e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor={`video${index}`} className={styles.label}>Upload Video:</label>
                            <input type="file" id={`video${index}`} className={styles.input} onChange={(e) => handleVideoUpload(index, e.target.files[0])} />
                        </div>
                        <button type="button" onClick={() => handleRemoveChapter(index)} className={styles.removeChapterButton}>Remove Chapter</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddChapter} className={styles.addChapterButton}>Add Chapter</button>
                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default AddCourse;

