// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
const firebaseConfig = {
    apiKey: 'AIzaSyBVy5hdSh_aYWye_54x2yuECq9SKkDm4TI',
    appId: '1:580158636960:web:5012a0e50e29334a49dac5',
    messagingSenderId: '580158636960',
    projectId: 'larapushnati',
    authDomain: 'larapushnati.firebaseapp.com',
    storageBucket: 'larapushnati.appspot.com',
    measurementId: 'G-X39508JT03',
};
// Initialize Firebase
firebaseConfig.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebaseConfig.messaging();

messaging.onBackgroundMessage(function(payload) {
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
