import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackLogin } from '../utils/analytics';
import { LoadingSpinner } from '../components/Loading';
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const { login, loginWithGoogle, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      await login(email, password);
      trackLogin('email');
      toast.success("Logged in");
      navigate('/');
    } catch (err) {
      if (err.code == "auth/network-request-failed") {
        toast.error("Check your internet connection");
      } else {
        setError("Invalid Credential");
        toast.error("Invalid Credential");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {

      // Check if we're in a secure context and popups are allowed
      if (window.opener && !window.opener.closed) {
        toast.error("Please allow popups for Google login");
        return;
      }
      setError('');
      await loginWithGoogle();
      trackLogin('google');
      toast.success("Logged in");
      navigate('/');
    } catch (err) {
      // Handle specific error cases
      if (err.code == "auth/internal-error") {
        toast.error("Check your internet connection");
      } else if (err.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups for Google login.");
      } else if (err.code === "auth/popup-closed-by-user") {
        toast.info("Login cancelled.");
      } else if (err.code === "auth/cancelled-popup-request") {
        toast.error("Multiple login attempts detected. Please try again.");
      } else if (err.code === "auth/user-cancelled") {
        toast.error("Permission Denied");
      } else {
        toast.error("Google login failed. Please try again.");
        setError("Google login failed.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4 rounded-lg shadow-lg"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} id="login-form" className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
            required
          />
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl pr-10 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={authLoading}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: authLoading ? "bg-blue-700" : "bg-blue-500",
              scale: authLoading ? 0.98 : 1,
            }}
            transition={{ duration: 0.3 }}
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          >
            {authLoading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              "Login"
            )}
          </motion.button>
          <ToastContainer />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;