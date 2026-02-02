import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, UserCog, LogOut, CircleUserRound } from 'lucide-react'; // Icons
import { ToastContainer, toast } from 'react-toastify';

function Navbar() {
  const { currentUser, userProfile, userRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have loged out.");
      navigate('/');
    } catch (error) {
      toast.error("Failed to loged out");
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const NavLink = ({ to, children, icon }) => (
    <Link
      to={to}
      className="flex items-center p-3 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors duration-200"
      onClick={() => setIsOpen(false)}
    >
      {icon}
      <span className="ml-4 font-semibold">{children}</span>
    </Link>
  );

  return (
    <>
      {/* Menu Icon */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-gray-900 text-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <ToastContainer />

                {/* User Great */}
                {currentUser ? (
                  <h2 className="text-xl font-bold">Hi, {userProfile?.name}</h2>
                ) : (
                  <h2 className="text-xl font-bold">Hi, User</h2>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-700 focus:outline-none cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" icon={<Home size={20} />}>Home</NavLink>
                <NavLink to="/about" icon={<CircleUserRound size={20} />}>About</NavLink>
                {userRole === 'admin' && (
                  <NavLink to="/admin" icon={<UserCog size={20} />}>Admin</NavLink>
                )}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut size={20} className="mr-3" />
                  <span className="font-semibold">Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;