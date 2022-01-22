const functions = require("firebase-functions");
const admin = require("\"firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const env = functions.config();

const algoliasearch = require("algoliasearch");

const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex("user_search");

exports.indexUser = functions.firestore
    .document("users/{userId}")
    .onCreate((snap, context) => {
      const data = snap.data();
      data.objectID = context.params.noteId;

      const index = client.initIndex("user_search");
      return index.saveObject(data);
    });

exports.unindexUser = functions.firestore
    .document("users/{userId}")
    .onDelete((snap, context) => {
      const objectId = snap.id;

      return index.deleteObject(objectId);
    });
