// firebase.js
import {initializeApp} from 'firebase/app';
import {getMessaging, getToken} from 'firebase/messaging';


const firebaseConfig = {
    apiKey: 'AIzaSyBVy5hdSh_aYWye_54x2yuECq9SKkDm4TI',
    appId: '1:580158636960:web:5012a0e50e29334a49dac5',
    messagingSenderId: '580158636960',
    projectId: 'larapushnati',
    authDomain: 'larapushnati.firebaseapp.com',
    storageBucket: 'larapushnati.appspot.com',
    measurementId: 'G-X39508JT03',
};
const vapidkey = "BEF60idpPb8BxKtZLebEiOS0n5CpLd1Jo2g3ARkyqQLZyxm5cXwDjnb23YCkl6-R_oTjoLT0EXIQbHnoM4Jbp4Q"
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFCMToken = async () => {
    try {
        // Request permission to display notifications
        const currentToken = await getToken(messaging, {vapidKey: vapidkey});
        if (currentToken) {
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving the token. ', error);
    }
};