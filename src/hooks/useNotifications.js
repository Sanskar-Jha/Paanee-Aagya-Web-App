import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission, setupForegroundMessages, isNotificationSupported, getNotificationPermission } from '../utils/notifications';

export function useNotifications() {
    const { currentUser } = useAuth();
    const [notificationSupported, setNotificationSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isLoading, setIsLoading] = useState(false);

    // Check notification support and permission on mount
    useEffect(() => {
        const checkNotificationSupport = () => {
            const supported = isNotificationSupported();
            setNotificationSupported(supported);

            if (supported) {
                const currentPermission = getNotificationPermission();
                setPermission(currentPermission);
            }
        };

        checkNotificationSupport();
    }, []);

    // Setup foreground message listener
    useEffect(() => {
        if (notificationSupported && permission === 'granted') {
            const unsubscribe = setupForegroundMessages((payload) => {
                // console.log('Foreground message received:', payload);
                // You can add custom handling here, like showing a toast
            });

            return unsubscribe;
        }
    }, [notificationSupported, permission]);

    // Request notification permission
    const enableNotifications = useCallback(async () => {
        if (!currentUser || !notificationSupported) {
            // console.log('Notifications not supported or user not logged in');
            return false;
        }

        try {
            setIsLoading(true);
            const token = await requestNotificationPermission(currentUser.uid);

            if (token) {
                setPermission('granted');
                return true;
            } else {
                setPermission(Notification.permission);
                return false;
            }
        } catch (error) {
            // console.error('Error enabling notifications:', error);
            setPermission(Notification.permission);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, notificationSupported]);

    // Check if notifications are enabled
    const areNotificationsEnabled = permission === 'granted';

    return {
        notificationSupported,
        permission,
        areNotificationsEnabled,
        isLoading,
        enableNotifications,
        isNotificationSupported: () => notificationSupported
    };
}