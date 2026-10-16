const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");

function activityDate(value) {
  return value ? value.toDate().toJSON() : undefined;
}

function evidenceActivity(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    matchId: data.projectId,
    link: data.evidenceUrl,
    date: activityDate(data.evidenceCreatedAt),
    collectionDB: "evidence",
    evidenceModifier: data.modifier,
  };
}

function awardActivity(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    matchId: data.awardId,
    link: data.awardUrl,
    date: activityDate(data.awardCreatedAt),
    collectionDB: "awards",
  };
}

async function refreshActivityCache(db, userId) {
  const cacheRef = db.collection("activity-cache")
      .doc(`activity: userId == ${userId}`);

  await db.runTransaction(async (transaction) => {
    // Reading the cache document makes concurrent refreshes retry rather than
    // allowing an older source snapshot to replace a newer cache entry.
    await transaction.get(cacheRef);
    const [evidence, awards] = await Promise.all([
      transaction.get(db.collection("evidence").where("userId", "==", userId)),
      transaction.get(db.collection("awards").where("userId", "==", userId)),
    ]);
    const activity = [
      ...evidence.docs.map(evidenceActivity),
      ...awards.docs.map(awardActivity),
    ];
    transaction.set(cacheRef, {
      version: 2,
      payload: JSON.stringify(activity),
      generatedAt: FieldValue.serverTimestamp(),
    });
  });
}

function createActivityCacheTrigger(sourceCollection, databaseId) {
  const db = databaseId ? getFirestore(databaseId) : getFirestore();
  const options = {
    document: `${sourceCollection}/{docId}`,
    region: "us-central1",
  };
  if (databaseId) options.database = databaseId;

  return onDocumentWritten(options, async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const beforeUserId = before && before.userId;
    const afterUserId = after && after.userId;
    const userIds = new Set([beforeUserId, afterUserId].filter(Boolean));
    await Promise.all([...userIds].map((userId) =>
      refreshActivityCache(db, userId)));
  });
}

module.exports = {createActivityCacheTrigger};
