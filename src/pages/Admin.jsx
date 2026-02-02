import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { trackScheduleUpdate, trackPageView } from '../utils/analytics';
import Navbar from "../components/Navbar.jsx"
import SelectUserArea from '../components/SelectUserArea.jsx';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';

function Admin() {
  const { addSchedule, schedulesLoading } = useAuth();
  const [area, setArea] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackPageView('admin');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("⏳ Network timeout. Please check your internet and try again.")), 10000)
    );

    try {
      await Promise.race([
        addSchedule(area, day, startTime, endTime),
        trackScheduleUpdate(area, day),
        timeoutPromise
      ]);
      toast.success("✅ Schedule saved!");

      // Reset form
      setArea('');
      setDay('');
      setStartTime('');
      setEndTime('');

    } catch (err) {
      toast.error("❌ Failed to save schedule: Please check your connection.");
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
        <Navbar />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Panel</h2>
        <form onSubmit={handleSubmit} id='admin-form' className="space-y-4">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select value={area} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" onChange={(e) => setArea(e.target.value)} required>
              <option value="">Select Area</option>
              <SelectUserArea />
            </select>
          </div>

          <div className="relative">
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select value={day} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" onChange={(e) => setDay(e.target.value)} required>
              <option value="">Select Day</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>


          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              id="start-time"
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              id="end-time"
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={{
              opacity: loading ? 0.6 : 1,
              scale: loading ? 0.98 : 1,
            }}
            transition={{ duration: 0.3 }}
            type="submit"
            disabled={schedulesLoading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {(schedulesLoading) ? "Saving..." : "Save Schedule"}
          </motion.button>
          <ToastContainer />
        </form>
      </div>
    </motion.div>
  );
}

export default Admin;