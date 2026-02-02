import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackSignup } from '../utils/analytics';
import SelectUserArea from '../components/SelectUserArea';
import { LoadingSpinner } from '../components/Loading';
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';

export default function Signup() {
  const { signup, authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(''); // Client-side validation states
  const [passwordError, setPasswordError] = useState(''); // Client-side validation states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email format validation at Client side
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle setEmail
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.length > 0 && !isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Handle setpassword
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0 && newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final client-side validation check
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Prevent signup if the user hasn't selected a valid area
    if (area === "" || area === "Select") {
      setError("Please select a valid area.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError('');
      setLoading(true);
      await signup(name, email, area, password);
      trackSignup('email');
      toast.success("✅ Signup successful!");
      navigate('/login');
    } catch (err) {
      if (err.code == "auth/email-already-in-use") {
        toast.error("Account already exists. Please log in");
      } else {
        const errorMessage = err.message.split("/").pop().slice(0, -2);
        setError(errorMessage);
        toast.error("Failed to create an account");
      }
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign-up</h2>
        <form onSubmit={handleSubmit} id="signup-form" className="space-y-4">
          <input
            type="name"
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            disabled={authLoading}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={handleEmailChange}
            disabled={authLoading}
            required
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

          <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" value={area} onChange={e => { setArea(e.target.value) }}>
            <option>Select</option>
            <SelectUserArea />
          </select>

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl pr-10 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={handlePasswordChange}
              disabled={authLoading}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl pr-10 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={authLoading}
              required
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
            disabled={authLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          >
            {loading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              "Sign up"
            )}
          </motion.button>
          <ToastContainer />
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 focus:outline-none">Already have an account? Login</Link>
        </div>
      </div>
    </motion.div>
  );
}