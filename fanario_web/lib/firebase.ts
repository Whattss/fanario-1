import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyB5TSfP32FyRwbZzGkNZ1p-U5IlRia5tZs",
  authDomain: "fanario-es.firebaseapp.com",
  databaseURL:
    "https://fanario-es-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fanario-es",
  storageBucket: "fanario-es.firebasestorage.app",
  messagingSenderId: "937595182382",
  appId: "1:937595182382:web:4419513c0f3848c7f46ebf",
  measurementId: "G-3C4FEVRD2Z",
};

// ✅ Evita re-inicializar (Next + hot reload + SSR)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Productos que usas
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Analytics SOLO en cliente y si está soportado
export const analytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};
