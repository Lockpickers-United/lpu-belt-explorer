const admin = require('firebase-admin')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = admin.firestore(app)

const idHistory = [
    {oldId: '', newId: ''},
]
const collections = ['own', 'picked', 'recorded', 'wishlist']
const idPromises = idHistory.map(async ({oldId, newId}) => {
    const collectionPromises = collections.map(async key => {
        const docs = await db
            .collection('lockcollections')
            .where(key, 'array-contains', oldId)
            .get()

        if (docs.size === 0) console.log('No documents found', key, oldId, newId)
        docs.forEach(doc => {
            const userId = doc.id
            const data = doc.data()

            console.log('Fixing', userId, key, data[key].includes(oldId), data[key].includes(newId) || !newId)
            data[key] = data[key].filter(id => id !== oldId)
            if (!data[key].includes(newId) && newId) data[key].push(newId)

            // doc.ref.set(data)
            console.log('Fixed', userId, key, data[key].includes(oldId), data[key].includes(newId) || !newId, '\n')
        })
    })
    await Promise.all(collectionPromises)
})
Promise.all(idPromises)
