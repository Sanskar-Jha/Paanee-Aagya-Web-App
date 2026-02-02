importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYWDdPfNUSSYTTphJPI3xkk3_TB-cykCY",
  authDomain: "paanee-aagya.firebaseapp.com",
  projectId: "paanee-aagya",
  storageBucket: "paanee-aagya.firebasestorage.app",
  messagingSenderId: "652989834421",
  appId: "1:652989834421:web:473ece63e7eb5162c34afc",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

const CACHE_NAME = "paanee-aagya-v1.0.0";
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache the new response
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request.url, fetchResponse.clone());
                return fetchResponse;
              });
          })
          .catch(() => {
            // Fallback for failed requests
            if (event.request.destination === "document") {
              return caches.match('/');
            }
          });
      })
  );
});

// Background message handler
messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "Paanee Aagya";
  const notificationOptions = {
    body: payload.notification?.body || "New update available",
    icon: "/icons/paaneeAagya_logo_192.png",
    badge: "/icons/paaneeAagya_favicon.png",
    tag: "water-schedule", // Group similar notifications
    requireInteraction: true, // Keep notification until user interacts
    data: payload.data || {},
    actions: [
      {
        action: "view",
        title: "View Schedule"
      },
      {
        action: "dismiss",
        title: "Dismiss"
      }
    ]
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  // console.log("[firebase-messaging-sw.js] Notification click received:", event);

  event.notification.close();

  const handleClick = async () => {
    const allClients = await clients.matchAll({
      type: 'window',
    });

    // Check if app is already open
    for (const client of allClients) {
      if (client.url.includes('/home') && 'focus' in client) {
        return client.focus();
      }
    }

    // If app is not open, open it
    if (clients.openWindow) {
      return clients.openWindow('/home');
    }
  };

  if (event.action === "view") {
    event.waitUntil(handleClick());
  } else if (event.action === "dismiss") {
    // Notification dismissed - do nothing
    // console.log("Notification dismissed by user");
  } else {
    // Default click behavior
    event.waitUntil(handleClick());
  }
});
