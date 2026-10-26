const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp, 'lpubelts-dev')

// CREATE MESSAGE
//createMessage()

// CLEAR DISMISSED MESSAGES
const userId = 'GGplAdctTfVDLVvYsfIADJmfp8f2'
clearDismissed()


const messageId = 'ed4533f1'
const messsageData = {
    'id': messageId,
    'description': 'test alert',
    'active': true,
    'priority': '9',
    'messageType': 'Alert',
    'messageHeadline': 'Alert!',
    'messageText': 'Sample message for testing',
    'pageIds': ['/safelocks'],
    'noDismiss': true,
    'targetAnonymousNotOK': false,
    'targetLoggedIn': false,
    'targetCollectionUsersOnly': false,
    'targetBlackBeltsOnly': false,
    'targetUserIds': false,
    'targetAdminOnly': true
}

function createMessage() { // eslint-disable-line
    const ref = db.doc(`/system-messages/${messageId}`)
    ref.set(messsageData)
}

function clearDismissed() { // eslint-disable-line
    const ref = db.doc(`/lockcollections/${userId}`)
    ref.update({dismissedMessages: []})
}