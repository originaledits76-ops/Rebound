import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

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


// Helper methods for levels
export async function getCampaignLevel(levelId) {
    try {
        const docRef = doc(db, 'campaign_levels', levelId.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (e) {
        console.error("Error fetching campaign level:", e);
        return null;
    }
}
