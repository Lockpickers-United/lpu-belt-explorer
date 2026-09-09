/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions")
// const {onRequest} = require("firebase-functions/https")
const logger = require("firebase-functions/logger")

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10})

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {initializeApp} = require("firebase-admin/app")
const {getFirestore, FieldValue} = require("firebase-admin/firestore")
const {onDocumentWritten} = require("firebase-functions/v2/firestore")

initializeApp()

const db = getFirestore()

/**
 * Creates a Firestore document-write trigger that records changed document IDs.
 *
 * @param {string} sourceCollection Source collection to observe.
 * @param {string} changeIndexCollection Collection storing change index docs.
 * @return {CloudFunction} Firestore document-write trigger.
 */
function createChangeTracker(sourceCollection, changeIndexCollection) {
  return onDocumentWritten(
      {
        document: `${sourceCollection}/{docId}`,
        region: "us-central1",
      },
      async (event) => {
        const {docId} = event.params
        const deleted = !event.data.after.exists

        await db.collection(changeIndexCollection).doc(docId).set({
          docId,
          changedAt: FieldValue.serverTimestamp(),
          deleted,
          sourceCollection,
        }, {merge: true})

        logger.info("Indexed Firestore document change", {
          sourceCollection,
          changeIndexCollection,
          docId,
          deleted,
        })
      },
  )
}

exports.trackLockcollectionChange = createChangeTracker(
    "lockcollections",
    "lockcollectionsChangeIndex",
)

exports.trackAwardChange = createChangeTracker(
    "awards",
    "awardsChangeIndex",
)

exports.trackEvidenceChange = createChangeTracker(
    "evidence",
    "evidenceChangeIndex",
)
