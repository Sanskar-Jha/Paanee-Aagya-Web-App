import React from 'react';
import Navbar from '../components/Navbar';
import SelectUserArea from '../components/SelectUserArea';
import { motion } from 'framer-motion';
import { Droplets, Clock, MapPin, Shield, Smartphone, Users } from 'lucide-react';
import { areaList } from '../utils/areaList';

export default function About() {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Schedules",
      description: "Get live updates on water supply timings for your area. Never miss your water supply again."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Area-based Updates",
      description: "Specific schedules for Paras Vihar, Naka Chandravadni Gali No. 3 & 4. More areas coming soon."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Ensures your data stays safe and accessible only to you."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "PWA Ready",
      description: "Install on your home screen for instant access."
    },
    // {
    //   icon: <Users className="w-8 h-8" />,
    //   title: "Dual Access",
    //   description: "Residents view schedules, Admins manage and update timings for their areas."
    // },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Water Management",
      description: "Optimize your daily routine with accurate water supply predictions and notifications."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <img src="../../icons/paanee_aagya_favicon.png" className="w-18 h-18 text-white" alt="" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-blue-600">Paanee Aagya</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted companion for reliable water supply schedules and community water management.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Paanee Aagya was born from the need for reliable, real-time water supply information
                in our community. We understand the importance of water in daily life and the
                frustration of unpredictable supply schedules.
              </p>
              <p className="text-lg text-gray-700">
                Our platform bridges the communication gap between water management authorities
                and residents, ensuring everyone stays informed and prepared.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Covered Areas</h3>
              <ul className="space-y-2">
                {areaList.map((area, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Paanee Aagya?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">Vite</span>
              </div>
              <h3 className="font-semibold text-gray-800">Frontend Build</h3>
              <p className="text-sm text-gray-600 mt-1">Lightning Fast Development</p>
            </div> */}

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">React</span>
              </div>
              <h3 className="font-semibold text-gray-800">Frontend Build</h3>
              <p className="text-sm text-gray-600 mt-1">Fast Development & Modern UI</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <h3 className="font-semibold text-gray-800">Backend</h3>
              <p className="text-sm text-gray-600 mt-1">Real-time Database & Security</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">PWA</span>
              </div>
              <h3 className="font-semibold text-gray-800">Progressive Web App</h3>
              <p className="text-sm text-gray-600 mt-1">Installable</p>
            </div>
          </div>
        </motion.div>

        {/* User Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">For Everyone</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Residents</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• View daily water schedules</li>
                <li>• Get area-specific updates</li>
                <li>• Install as PWA for quick access</li>
                <li>• Real-time notifications</li>
              </ul>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Update water schedules</li>
                <li>• Manage multiple areas</li>
                <li>• Set timing for different days</li>
                <li>• Ensure community awareness</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to never miss your water supply again?
          </h3>
          <p className="text-gray-600 text-lg">
            Join Paanee Aagya today and stay informed about your water schedule.
          </p>
        </motion.div>
      </div>
    </div>
  );
}