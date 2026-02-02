import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';

function CompleteProfile() {
    const [formData, setFormData] = useState({
        name: '',
        area: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { currentUser, updateProfile, userProfile } = useAuth();
    const navigate = useNavigate();

    // Pre-fill name if available from Google account
    React.useEffect(() => {
        if (currentUser.displayName) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.displayName
            }));
        }
    }, [userProfile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            return setError("Please fill your name");
        }

        // Prevent if the user hasn't selected a valid area
        if (formData.area === "" || formData.area === "Select your area") {
            setError("Please select a valid area");
            return;
        }

        try {
            setError('');
            setLoading(true);
            await updateProfile(currentUser.uid, {
                name: formData.name,
                area: formData.area
            });
            toast.success("✅ Profile Updated!");
            navigate('/');
        } catch (error) {
            toast.error("Failed to update profile");
            setError('Failed to update profile: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center min-h-screen bg-gray-100 p-4 shadow-lg"
        >
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Complete Your Profile</h2>
                <p className="text-sm text-center text-gray-600 mb-6">Please provide some additional information to complete your profile.</p>

                <form onSubmit={handleSubmit} id="signup-form" className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                            Area *
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" name="area" value={formData.area}
                            onChange={handleChange}>
                            <option>Select your area</option>
                            <option>Paras Vihar</option>
                            <option>Naka Chandravadni Gali No. 3</option>
                            <option>Naka Chandravadni Gali No. 4</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            opacity: loading ? 0.6 : 1,
                            scale: loading ? 0.98 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 mt-5 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                    >
                        {loading ? "Updating..." : "Update"}
                    </motion.button>
                    <ToastContainer />
                </form>
            </div>
        </motion.div>
    );
}

export default CompleteProfile;