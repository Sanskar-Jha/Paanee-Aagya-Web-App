import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

// Track user authentication events
export const trackLogin = (method) => {
    logEvent(analytics, 'login', { method });
};

export const trackSignup = (method) => {
    logEvent(analytics, 'sign_up', { method });
};

export const trackLogout = () => {
    logEvent(analytics, 'logout');
};

// Track schedule events
export const trackScheduleView = (area) => {
    logEvent(analytics, 'view_schedule', { area });
};

export const trackScheduleUpdate = (area, day) => {
    logEvent(analytics, 'update_schedule', { area, day });
};

// Track app engagement
export const trackPageView = (pageName) => {
    logEvent(analytics, 'page_view', { page_name: pageName });
};

export const trackAppInstall = () => {
    logEvent(analytics, 'app_install');
};

// Track errors
export const trackError = (errorType, errorMessage) => {
    logEvent(analytics, 'error', { type: errorType, message: errorMessage });
};