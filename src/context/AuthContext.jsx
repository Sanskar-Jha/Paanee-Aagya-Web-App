import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [userArea, setUserArea] = useState(null);
  const [todayTime, setTodayTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Helper function to get day name
  const getTodayDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Handle signup
  const signup = async (name, email, area, password) => {
    setAuthLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore with default 'user' role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        area: area,
        role: 'user', // Default role
        profileCompleted: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      return userCredential;
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle login with email/password
  const login = async (email, password) => {
    setAuthLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date()
      }, { merge: true });

      return userCredential;
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle login with Google
  const loginWithGoogle = async () => {
    setAuthLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create user document with profileCompleted false for Google sign-in
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'User',
          email: user.email,
          area: '',
          role: 'user', // Default role
          profileCompleted: false, // Mark as incomplete for Google users
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Update last login time
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }

      return userCredential;
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle is profile updated
  const updateProfile = async (userId, updates) => {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      profileCompleted: true
    });

    // Refresh user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      setUserProfile(userDoc.data());
    }
  };

  const needsProfileCompletion = () => {
    return currentUser && (!userProfile?.profileCompleted || !userProfile?.area);
  };

  // Handle logout
  const logout = () => {
    return signOut(auth);
  };

  // Handle admin
  const isAdmin = () => {
    return userRole === 'admin';
  };

  const setupUserNotifications = async () => {
    if (currentUser && userProfile?.area) {
      try {
        // This will be implemented when we create Cloud Functions
        // console.log('Setting up notifications for user:', currentUser.uid);

        // For now, we'll just ensure the user has granted permission
        const { requestNotificationPermission } = await import('../utils/notifications');
        await requestNotificationPermission(currentUser.uid);

      } catch (error) {
        // console.error('Error setting up user notifications:', error);
      }
    }
  };

  // Add or update schedule (unique by area + day)
  const addSchedule = async (area, day, startTime, endTime) => {
    setSchedulesLoading(true);

    try {
      const docId = `${area}_${day}`.replace(/\s+/g, '_'); // unique doc for area+day
      await setDoc(doc(db, "schedules", docId), {
        area,
        day,
        startTime,
        endTime,
        time: `${startTime} - ${endTime}`, // keep combined string for display
      }, { merge: true });

      return { area, day, startTime, endTime };
    } finally {
      setSchedulesLoading(false);
    }
  }

  // Call this when user profile is updated or area changes
  useEffect(() => {
    if (userProfile?.area && currentUser) {
      setupUserNotifications();
    }
  }, [userProfile?.area, currentUser]);

  // Fetch schedules when user area changes
  useEffect(() => {
    if (userArea) {
      setSchedulesLoading(true);

      const schedulesQuery = query(
        collection(db, "schedules"),
        where("area", "==", userArea)
      );

      const unsubscribe = onSnapshot(schedulesQuery,
        (snapshot) => {
          const fetchedSchedules = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const today = getTodayDayName();
          const todaySchedule = fetchedSchedules.find((s) => s.day === today);
          setTodayTime(todaySchedule ? todaySchedule.time : "Not Scheduled Today");
          setSchedules(fetchedSchedules);
          setSchedulesLoading(false);

        },
        (error) => {
          setSchedulesLoading(false);
          // console.error("Error fetching schedules:", error);
        }
      );

      return () => unsubscribe();
    }

  }, [userArea]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          setUserRole(userData.role);
          setUserArea(userData.area); // Set user area for schedule queries
        }
        else {
          setUserRole('user');
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserProfile(null);
        setUserArea(null);
        setSchedules([]);
        setTodayTime(null);
      }
      setLoading(true);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, userProfile, userRole, schedules, todayTime, userArea, addSchedule, schedulesLoading, authLoading, loading, signup, login, loginWithGoogle, logout, isAdmin, updateProfile, needsProfileCompletion, setupUserNotifications };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}