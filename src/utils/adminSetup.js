import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to set a user as admin
export const setUserAsAdmin = async (userId, email) => {
    try {
        await setDoc(doc(db, 'users', userId), {
            email: email,
            role: 'admin',
            createdAt: new Date(),
            isAdmin: true
        }, { merge: true });

        console.log(`User ${email} has been set as admin`);
        return true;
    } catch (error) {
        console.error('Error setting admin role:', error);
        return false;
    }
};

// Function to create initial admin user (run this once)
export const createInitialAdmin = async (userId, email) => {
    return await setUserAsAdmin(userId, email);
};