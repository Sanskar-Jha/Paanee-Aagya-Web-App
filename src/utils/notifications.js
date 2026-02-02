import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Request notification permission
export const requestNotificationPermission = async (userId) => {
    try {
        // console.log('Requesting notification permission...');

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            // console.log('Notification permission granted.');

            // Get FCM token
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (token) {
                // console.log('FCM token:', token);

                // Save token to user's document in Firestore
                await updateDoc(doc(db, 'users', userId), {
                    fcmTokens: token,
                    notificationEnabled: true,
                    notificationPermissionGranted: true
                });

                return token;
            } else {
                // console.log('No registration token available.');
                return null;
            }
        } else {
            // console.log('Unable to get permission to notify.');
            await updateDoc(doc(db, 'users', userId), {
                notificationEnabled: false,
                notificationPermissionGranted: false
            });
            return null;
        }
    } catch (err) {
        // console.error('Error requesting notification permission:', err);
        return null;
    }
};

// Listen for foreground messages
export const setupForegroundMessages = (callback) => {
    return onMessage(messaging, (payload) => {
        // console.log('Received foreground message:', payload);

        // Show notification even when app is in foreground
        if (payload.notification) {
            const { title, body } = payload.notification;

            // Create and show notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: '/icons/paaneeAagya_logo_192.png',
                    badge: '/icons/paaneeAagya_favicon.png'
                });
            }
        }

        // Call callback with payload data
        if (callback) {
            callback(payload);
        }
    });
};

// Check if notifications are supported
export const isNotificationSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
};

// Check current notification permission
export const getNotificationPermission = () => {
    return Notification.permission;
};