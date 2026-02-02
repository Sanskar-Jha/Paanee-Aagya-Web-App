import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

export function LoadingSpinner({ size = "default", text = "Loading..." }) {
    const sizes = {
        small: "w-5 h-5",
        default: "w-16 h-16",
        large: "w-20 h-20"
    };

    return (
        <div className="flex flex-col items-center justify-center p-1">
            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity }
                }}
                className={`${sizes[size]}`}
            >
                <img src="../../icons/paanee_aagya_favicon.png" className="w-full h-full" alt="" />
            </motion.div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-gray-600 text-sm font-medium"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

export function LoadingOverlay({ message = "Loading..." }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                <LoadingSpinner size="large" text={message} />
            </div>
        </motion.div>
    );
}

export function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="flex space-x-4">
                <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    );
}