const admin = require('firebase-admin')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const {getFirestore} = require('firebase-admin/firestore')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

const prod = true
const db = prod ? getFirestore(app) : getFirestore(app, 'lpubelts-dev')

const action = 'deleteDeletedDocuments' // 'deleteDeletedDocuments' // 'getDocument' // 'setDocument'

async function setDocument() { // eslint-disable-line
    const collection = 'ranking-requests'
    const docId = 'b4062ca1'

    const data = {'id':'b4062ca1','makeModels':[{'make':'ABUS','model':'82/63'}],'displayName':'undefined','lockingMechanisms':['Pin-tumbler'],'lastUpdated':'2025-04-13T23:19:15.207Z','requestStatus':'Submitted','dateRequested':'2025-04-10T21:50:55.329Z','notes':'Unguttable. Lock is bypassable. Expect it to be in-between yellow/orange belt. Leaning more towards orange. 5 pins. Seems to have several spools.','usernames':{'discord':'Jonis326','reddit':'Jonis326'},'requestCount':9,'media':[{'fullUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001202_jonis326_jonis326.jpg','thumbnailUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001202_jonis326_jonis326-500.jpg','sequenceId':1,'fullSizeUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001202_jonis326_jonis326-1024.jpg','title':'By: Jonis326','dateAdded':'2025-04-10T21:50:55.835Z','subtitle':'CC BY-NC-SA 4.0'},{'fullSizeUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001201_jonis326_jonis326-1024.jpg','thumbnailUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001201_jonis326_jonis326-500.jpg','title':'By: Jonis326','sequenceId':2,'dateAdded':'2025-04-10T21:50:55.894Z','fullUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001201_jonis326_jonis326.jpg','subtitle':'CC BY-NC-SA 4.0'},{'dateAdded':'2025-04-10T21:50:55.690Z','sequenceId':3,'fullSizeUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001200_jonis326_jonis326-1024.jpg','subtitle':'CC BY-NC-SA 4.0','thumbnailUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001200_jonis326_jonis326-500.jpg','fullUrl':'https://explore.lpubelts.com/img/requestedLocks/abus_82+63-jonis326_jonis326/abus_82+63_1000001200_jonis326_jonis326.jpg','title':'By: Jonis326'}],'danPoints':0,'approximateBelt':'Orange','hazLocc':'Yes','requestedBy':[{'userId':'Vj5LYU6ssOfCpdd7lfddGuvmSuO2','discordUsername':'Jonis326','owner':true}]}
    try {
        const ref = db.doc(`/${collection}/${docId}`)
        await ref.set(data)
    } catch (error) {
        console.error(`Error setting document ${docId}:`, error)
    }
}

async function getDocument() {
    const collection = 'ranking-requests'
    const docId = '470e2912'

    try {
        const ref = db.doc(`/${collection}/${docId}`)
        const docRef = await ref.get()
        console.log(JSON.stringify(docRef.data()))
    } catch (error) {
        console.error(`Error getting document ${docId}:`, error)
    }
}

async function deleteDeletedDocuments() {
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
    console.log(`Deleted ${querySnapshot.size} documents where requestStatus === "Deleted".`)
}

if (action === 'deleteDeletedDocuments') {
    deleteDeletedDocuments().then().catch(err => {
        console.error('Error deleting documents: ', err)
    })
} else if (action === 'getDocument') {
    getDocument().then().catch(err => {
        console.error('Error getting document: ', err)
    })
}else if (action === 'setDocument') {
    setDocument().then().catch(err => {
        console.error('Error setting document: ', err)
    })
}



