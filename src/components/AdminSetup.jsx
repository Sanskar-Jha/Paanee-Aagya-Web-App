import React, { useState } from 'react';
import { setUserAsAdmin } from '../utils/adminSetup';

function AdminSetup() {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const success = await setUserAsAdmin(userId, email);

        if (success) {
            setMessage('✅ User successfully set as admin!');
            setUserId('');
            setEmail('');
        } else {
            setMessage('❌ Failed to set user as admin. Please check the user ID.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Set User as Admin</h2>

            <form onSubmit={handleSetAdmin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        User ID (Firebase UID)
                    </label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Firebase User ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter user email"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                    {loading ? 'Setting Admin...' : 'Set as Admin'}
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-3 rounded-md ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message}
                </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                <h3 className="font-semibold text-yellow-800 mb-2">How to get User ID:</h3>
                <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                    <li>Go to Firebase Console</li>
                    <li>Navigate to Authentication → Users</li>
                    <li>Copy the "User UID" of the user you want to make admin</li>
                    <li>Paste it in the User ID field above</li>
                </ol>
            </div>
        </div>
    );
}

export default AdminSetup;