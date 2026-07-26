import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export async function submitLevelRequest({ name, email, request }) {
    try {
        const docRef = await addDoc(collection(db, 'level_requests'), {
            name: name.trim(),
            email: email.trim(),
            request: request.trim(),
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error submitting level request to Firestore:', error);
        throw error;
    }
}
