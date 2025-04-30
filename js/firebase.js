// Firebase configuration and initialization
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Restaurant data
const restaurants = [
    {
        id: "1",
        name: "Accessible Bistro",
        image: "../images/restaurant1.jpg",
        description: "A fully accessible dining experience with wheelchair ramps and braille menus.",
        features: [
            "Wheelchair ramps",
            "Braille menus",
            "Accessible restrooms",
            "Trained staff"
        ]
    },
    {
        id: "2",
        name: "Inclusive Cafe",
        image: "../images/restaurant2.jpg",
        description: "A cozy cafe with accessibility features for all customers.",
        features: [
            "Wide doorways",
            "Lowered counters",
            "Audio menus",
            "Service animal friendly"
        ]
    }
];

export { db, collection, addDoc, getDocs, query, where, storage, ref, uploadBytes, getDownloadURL, restaurants, auth };