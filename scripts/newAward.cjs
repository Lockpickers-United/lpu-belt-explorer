const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const {query, collection, where, getDocs} = require('firebase/firestore')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp, 'lpubelts-dev')

const awardImport = [
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '80e8bd11',
        'description': 'Dan 2',
        'date': '2023-07-02',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1125230415364509810'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '3a71ab4c',
        'description': 'Dan 3',
        'date': '2023-09-16',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1152795135227203734'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': 'c3a1b4e6',
        'description': 'Dan 4',
        'date': '2024-01-09',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1194422117475823656'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '46366349',
        'description': 'Dan 5',
        'date': '2024-02-17',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1208486055490224159'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '1636ddbe',
        'description': 'Dan 6',
        'date': '2024-03-31',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1224031738196660277'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '92398aa5',
        'description': 'Dan 7',
        'date': '2024-04-23',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1232468747390947328'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '69d67112',
        'description': 'Dan 8',
        'date': '2024-06-14',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1251128014016745512'
    },
    {
        'userId': 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3',
        'matchId': '24c543eb',
        'description': 'Dan 9',
        'date': '2024-09-15',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1284955864561619057'
    }
]



awardImport.map(awardData => {
    const award = {
        date: awardData.date + 'T23:59:59.000Z',
        matchId: awardData.matchId,
        awardUrl: awardData.awardUrl,
        userId: awardData.userId
    }
    addAward(award)
})

//deleteAwards('WMSvvuutyShfvBBYB3PmDe4fmeS2')

async function addAward(award) {
    const collection = db.collection('awards')
    await collection.add(award)
}

async function deleteAwards (userId) {
    const docs = await db.collection('awards').where('userId', '==', userId).get()
    docs.forEach(doc => {
        console.log('doc id', doc.id)
        db.collection('awards').doc(doc.id).delete();
    },[])

}



/*
id	        name
a5599aee	White Belt
6ce30c57	Yellow Belt
249dd56f	Orange Belt
8ad90321	Green Belt
39d91da5	Blue Belt
893d378f	Purple Belt
b8e10620	Brown Belt
752781a0	Red Belt
da7759a9	Black Belt
373342ef	Dan 1
80e8bd11	Dan 2
3a71ab4c	Dan 3
c3a1b4e6	Dan 4
46366349	Dan 5
1636ddbe	Dan 6
92398aa5	Dan 7
69d67112	Dan 8
24c543eb	Dan 9
58e6650f	Dan 10
13543ef8	Dan 11
54f3bd1f	Dan 12
5a69f6cc	Dan 13
544ce1c6	Dan 14
b8c496b6	Dan 15
17ea10b3	Dan 16
8793b8c0	Dan 17
a0e439ac	Dan 18
9c5e78d4	Dan 19
2febdcd3	Dan 20
3cf68365	Dan 21
6636bff8	Dan 22
697d21e6	Dan 23
1f748940	Dan 24
c75a6ed8	Dan 25
fcc79c63	Dan 26
49562b61	Dan 27
8ac0c35b	Dan 28
0004e56c	Dan 29
753181fd	Dan 30
*/

