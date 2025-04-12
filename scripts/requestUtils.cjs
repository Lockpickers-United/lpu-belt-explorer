const admin = require('firebase-admin')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const {getFirestore} = require('firebase-admin/firestore')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = getFirestore(app, 'lpubelts-dev')

const action = 'getDocument' // 'deleteDeletedDocuments' // 'getDocument'

async function getDocument() { // eslint-disable-line
    const collection = 'ranking-requests'
    const docId = 'b4062ca1'

    try {
        const ref = db.doc(`/${collection}/${docId}`)
        await ref.get().then((docRef) => {
            console.log(JSON.stringify(docRef.data()))
        })

    } catch (error) {
        console.error(`Error getting document ${docId}:`, error)
    }
}

async function deleteDeletedDocuments() { // eslint-disable-line
    const collectionRef = db.collection('ranking-requests')
    const querySnapshot = await collectionRef.where('requestStatus', '==', 'Deleted').get()
    if (querySnapshot.empty) {
        console.log('No documents with Status === "Deleted" found.')
        return
    }

    const batch = db.batch()
    querySnapshot.forEach(doc => {
        batch.delete(doc.ref)
    })
    await batch.commit()
    console.log(`Deleted ${querySnapshot.size} documents where Status === "Deleted".`)
}

if (action === 'deleteDeletedDocuments') {
    deleteDeletedDocuments().then().catch(err => {
        console.error('Error deleting documents: ', err)
    })
} else if (action === 'getDocument') {
    getDocument().then().catch(err => {
        console.error('Error getting document: ', err)
    })
}



