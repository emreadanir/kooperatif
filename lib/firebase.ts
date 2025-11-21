import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Config'i Belirle
// Tarayıcıda veya sunucuda çalışmasına göre doğru config'i seçer.
const firebaseConfigStr = typeof window !== 'undefined' && (window as any).__firebase_config;

const firebaseConfig = {
  apiKey: "AIzaSyAohl8EWKELLcCyuYJHac6C5_Oq_3m4IKw",
  authDomain: "kooperatif-base.firebaseapp.com",
  projectId: "kooperatif-base",
  storageBucket: "kooperatif-base.firebasestorage.app",
  messagingSenderId: "407261007978",
  appId: "1:407261007978:web:20608ce137fbda85ad7a13"
};

// 2. App ID'yi Belirle
// Veritabanında verileri hangi klasör altına yazacağımızı belirler.
// Localhost'ta çalışırken 'kooperatif-v1' ID'sini kullanacağız.
export const appId = typeof window !== 'undefined' && (window as any).__app_id 
  ? (window as any).__app_id 
  : 'kooperatif-v1'; 

// 3. Firebase'i Başlat (Singleton Pattern)
// Eğer daha önce başlatılmışsa onu getir, yoksa yenisini başlat.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);