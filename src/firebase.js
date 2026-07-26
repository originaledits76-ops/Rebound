import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "substantial-scholar-5nzsc",
    appId: "1:596551486989:web:d539882a590350a5b10f44",
    apiKey: "AIzaSyD4StaDgm_Qxj-gcqWmaizkdNkR_DO8x74",
    authDomain: "substantial-scholar-5nzsc.firebaseapp.com",
    storageBucket: "substantial-scholar-5nzsc.firebasestorage.app",
    messagingSenderId: "596551486989",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-puzzcoreframewor-580a6dbf-65dc-4d57-959f-bacbeddc8d91");

// Helper methods reserved ONLY for future community levels
export async function saveCustomLevel(levelData) {
    try {
        const levelId = levelData.id || 'custom_' + Date.now();
        const docRef = doc(db, 'custom_levels', levelId.toString());
        const payload = {
            ...levelData,
            id: levelId,
            updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, payload);
        return { success: true, id: levelId };
    } catch (e) {
        console.warn('Firebase save failed, fallback to local storage:', e);
        return { success: false, id: levelData.id || 'custom_' + Date.now(), error: e };
    }
}

export async function getCustomLevels() {
    try {
        const colRef = collection(db, 'custom_levels');
        const querySnap = await getDocs(colRef);
        const levels = [];
        querySnap.forEach((doc) => {
            levels.push(doc.data());
        });
        return levels;
    } catch (e) {
        console.warn('Firebase fetch custom levels failed:', e);
        return [];
    }
}
