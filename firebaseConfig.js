import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCHYz1Bh-Cx5zmDpqFs0U7DLfqv_NizRUc",
  authDomain: "neurobalance-mvp.firebaseapp.com",
  projectId: "neurobalance-mvp",
  storageBucket: "neurobalance-mvp.firebasestorage.app",
  messagingSenderId: "39252015620",
  appId: "1:39252015620:web:116c66f4531134c1b01351",
  measurementId: "G-8T4LH5YYFS"
};
 

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics suportado e iniciado.");
  } else {
    console.log("Firebase Analytics não é suportado neste ambiente.");
  }
});

export { auth, db };