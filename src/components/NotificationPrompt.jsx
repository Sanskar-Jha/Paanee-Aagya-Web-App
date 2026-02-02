import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationPrompt() {
    const { notificationSupported, areNotificationsEnabled, permission, isLoading, enableNotifications } = useNotifications();
    const [showPrompt, setShowPrompt] = React.useState(false);

    // Show prompt if notifications are supported but not enabled
    React.useEffect(() => {
        if (notificationSupported && !areNotificationsEnabled && permission === 'default') {
            // Wait a bit before showing prompt for better UX
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notificationSupported, areNotificationsEnabled, permission]);

    const handleEnable = async () => {
        const success = await enableNotifications();
        if (success) {
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store dismissal to not show again for a while
        localStorage.setItem('notificationPromptDismissed', Date.now().toString());
    };

    if (!showPrompt || !notificationSupported) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-blue-200 rounded-xl shadow-2xl z-50"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Get Water Schedule Alerts</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Never miss your water supply with timely notifications
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleEnable}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? 'Enabling...' : 'Enable Notifications'}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Later
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Get updates when schedules change and 10-minute reminders
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}