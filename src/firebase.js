import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCF1yZ3yqUXAim6BntWYwbzhLe-Fvfy1SI",
    authDomain: "instagram-clone-11526.firebaseapp.com",
    projectId: "instagram-clone-11526",
    storageBucket: "instagram-clone-11526.appspot.com",
    messagingSenderId: "919183627830",
    appId: "1:919183627830:web:f42d35e8dfe7404e99ea97"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
const storage = getStorage(app);


export { db,auth,storage };
//export default db;


  