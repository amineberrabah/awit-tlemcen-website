// ==========================================================================
// firebase-config.js
// Remplacez les valeurs ci-dessous par celles de VOTRE projet Firebase.
// Où les trouver : Firebase Console > Paramètres du projet > Vos applications > SDK setup and configuration
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyCYVO8itTMmuHdr3pD8XpMvbMfd8ZJ5d3w",
  authDomain: "trisomie21-589ab.firebaseapp.com",
  projectId: "trisomie21-589ab",
  storageBucket: "trisomie21-589ab.firebasestorage.app",
  messagingSenderId: "1082438518144",
  appId: "1:1082438518144:web:86600a447abed44f096d65"
};

// Ne pas modifier en dessous de cette ligne
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Le module Auth n'est chargé que sur les pages qui en ont besoin (admin, login).
// Sur les autres pages (contact, bénévole, don...), on évite l'erreur si le SDK Auth n'est pas présent.
const auth = (typeof firebase.auth === 'function') ? firebase.auth() : null;

