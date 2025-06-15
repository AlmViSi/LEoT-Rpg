if (typeof firebaseConfig === 'undefined') {
    console.error("firebaseConfig is not defined. Make sure firebase-config.js is loaded before firebase-init.js");
} else {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}