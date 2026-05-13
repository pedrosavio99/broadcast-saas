import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWKl5pJKomk7x3nim9WjH2V8A34SvCob0",
  authDomain: "broadcast-saas-2026psvo.firebaseapp.com",
  projectId: "broadcast-saas-2026psvo",
  storageBucket: "broadcast-saas-2026psvo.firebasestorage.app",
  messagingSenderId: "922799552943",
  appId: "1:922799552943:web:9d44f697ebc0c0126d175a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;