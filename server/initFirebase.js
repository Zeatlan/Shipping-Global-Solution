
// ---------------
// Setup Firebase
const firebase = require('firebase-admin');
const serviceAccount = require('./key.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const firestore = firebase.firestore();
const auth = firebase.auth();
// --------------

exports.firestore = firestore;
exports.auth = auth;