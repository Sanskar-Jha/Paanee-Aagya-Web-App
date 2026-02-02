import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, X } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatus() {
    const { isOnline, showOfflineBanner, setShowOfflineBanner } = useNetworkStatus();

    if (!showOfflineBanner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-0 left-0 right-0 z-50 p-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'
                    } text-white text-center font-medium`}
            >
                <div className="flex items-center justify-center space-x-2">
                    {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                    <span>
                        {isOnline ? 'Back online! Connection restored.' : 'You are currently offline. Some features may not work.'}
                    </span>
                    <button
                        onClick={() => setShowOfflineBanner(false)}
                        className="ml-4 p-1 hover:bg-white/20 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}