import { initializeApp, FirebaseOptions } from "firebase/app"

const FirebaseConfig: FirebaseOptions  = { 
  apiKey: "AIzaSyAQRI9jsuc728rP14mxCnukxteuT1P6GlE",
  authDomain: "projeto-web-20bbe.firebaseapp.com",
  projectId: "projeto-web-20bbe",
  storageBucket: "projeto-web-20bbe.firebasestorage.app",
  messagingSenderId: "670381142902",
  appId: "1:670381142902:web:fdf5c9658d0c55a0458057",
  measurementId: "G-EP7LP6G1T7"
}   

const firebase = initializeApp(FirebaseConfig);

export default firebase;