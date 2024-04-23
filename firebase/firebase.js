import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLMXNie3lLmeuARiyvrWeNKtENaAgCMWQ",
  authDomain: "online-learnin-platform.firebaseapp.com",
  projectId: "online-learnin-platform",
  storageBucket: "online-learnin-platform.appspot.com",
  messagingSenderId: "708366140184",
  appId: "1:708366140184:web:2bd32e8a92e09939e8d46d"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const provider = new GoogleAuthProvider()


export {auth, db, provider, storage}