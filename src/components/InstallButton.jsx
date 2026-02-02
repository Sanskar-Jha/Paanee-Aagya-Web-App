import React, { useState } from 'react';

export default function InstallButton({ onInstall }) {
    const [isInstalling, setIsInstalling] = useState(false);

    const handleInstall = async () => {
        setIsInstalling(true);
        try {
            await onInstall();
        } catch (error) {
            // console.error('Installation failed:', error);
        }
        setIsInstalling(false);
    };

    return (
        <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition-colors text-sm flex items-center space-x-2 disabled:opacity-50"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{isInstalling ? 'Installing...' : 'Install'}</span>
        </button>
    );
}