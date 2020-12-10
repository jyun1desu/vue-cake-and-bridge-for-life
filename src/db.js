import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCPvpuWyETLq0ag8WGlTddWUJjVc0kwP0Y",
    authDomain: "cake-bridge-for-life.firebaseapp.com",
    databaseURL: "https://cake-bridge-for-life-default-rtdb.firebaseio.com",
    projectId: "cake-bridge-for-life",
    storageBucket: "cake-bridge-for-life.appspot.com",
    messagingSenderId: "787966748364",
    appId: "1:787966748364:web:61513888a922b33deb4469",
    measurementId: "G-V1RGW705P4"
};

const db = firebase.initializeApp(firebaseConfig);
export default db; 