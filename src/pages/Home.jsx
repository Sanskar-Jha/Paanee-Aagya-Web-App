import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ScheduleCard from '../components/ScheduleCard';
import { trackPageView, trackScheduleView } from '../utils/analytics';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallButton from '../components/InstallButton';
import { LoadingSpinner, LoadingSkeleton } from '../components/Loading';
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";

function Home() {
  const { userProfile, todayTime, schedules, authLoading, schedulesLoading } = useAuth();
  const { canInstall, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    // Track page view
    trackPageView('home');

    // Track schedule view when schedules load
    if ((!schedulesLoading || !authLoading) && userProfile?.area) {
      trackScheduleView(userProfile.area);
    }
  }, [schedulesLoading, authLoading, userProfile?.area]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Install Button */}
      {canInstall && !isInstalled && (
        <div className="fixed top-4 right-4 z-40">
          <InstallButton onInstall={install} />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 pt-20">
        {/* Ḍisplay App Name */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Welcome to Paanee Aagya</h1>
            <p className="mt-2 text-lg text-gray-600">Your real-time water schedule updates.</p>
          </div>

          {/* Main Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <MapPin size={24} className="mr-2 text-blue-500" />
                <span className="text-sm md:text-base sm:max-w-none">
                  Area: {userProfile?.area || "Loading..."}
                </span>
              </h2>
            </div>

            {/* Today's Schedule */}
            <div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg shadow-inner mt-4">
              {schedulesLoading || authLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" text="" />
                  <span className="text-blue-800">Loading today's schedule...</span>
                </div>
              ) : (
                <p className="text-blue-800 font-medium">Today's Water Timing:{" "} <span className="font-bold">{todayTime || "Checking..."}</span></p>
              )}
            </div>

            {/* Weekly Schedule */}
            {schedulesLoading || authLoading ? (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Schedule</h3>
                <div className="space-y-3">
                  {[...Array(7)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : schedules.length > 0 ? (
              <ScheduleCard schedules={schedules} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No water schedules found for your area.</p>
                <p className="mt-2 text-sm">Please check back later for updates.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Home;