const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp, 'lpubelts-dev')


// SET USER ID & DATE AWARDED

const messageId = 'da2ed729'
const messsageData = {
    'id': messageId,
    'description': 'test neutral',
    'active': true,
    'priority': '1',
    'messageType': 'Neutral',
    'messageHeadline': 'Neutral message.',
    'messageText': 'Keep track of the locks you have picked (and the projects you have completed) complete with documentation links and dates!',
    'linkText': 'OK',
    'linkDestination': '/profile/view/scorecard',
    'pageIds': ['*'],
    'excludePageIds': ['/profile/scorecard', '/profile/edit'],
    'noDismiss': false,
    'targetAnonymousNotOK': false,
    'targetLoggedIn': false,
    'targetCollectionUsersOnly': false,
    'targetBlackBeltsOnly': false,
    'targetUserIds': false,
    'targetAdminOnly': false
}

createMessage()

//update profile
function createMessage() {
    const ref = db.doc(`/system-messages/${messageId}`)
    ref.set(messsageData)
}