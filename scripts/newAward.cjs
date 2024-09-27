const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore, Timestamp} = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp, 'lpubelts-dev')

const awardImport = [
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '5a69f6cc',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1269308574476009494',
        date: '2024-08-03',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '54f3bd1f',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1093471080024379422',
        date: '2023-04-06',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '13543ef8',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1067787904300109894',
        date: '2023-01-25',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '58e6650f',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1041272842253258822',
        date: '2022-11-13',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '24c543eb',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1030451347570565230',
        date: '2022-10-14',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '69d67112',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1018837741301157889',
        date: '2022-09-12',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '92398aa5',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1013669970288320602',
        date: '2022-08-28',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '1636ddbe',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/1008953403386368060',
        date: '2022-08-15',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '46366349',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/984755607091441725',
        date: '2022-06-10',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: 'c3a1b4e6',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/975649651753615490',
        date: '2022-05-15',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '3a71ab4c',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/954835341364330539',
        date: '2022-03-19',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '80e8bd11',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/952687657895489608',
        date: '2022-03-13',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '373342ef',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/913736182620381184',
        date: '2021-11-26',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: 'da7759a9',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/900017754432757821',
        date: '2021-10-19',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '752781a0',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/892763615055208508',
        date: '2021-09-29',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '8ad90321',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/876472698639904848',
        date: '2021-08-15',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: '6ce30c57',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/865945359813050378',
        date: '2021-07-17',
        collectionDB: 'awards'
    },
    {
        userId: 'XKPQaAR525XV2JsqGn12eEKwxD62',
        projectId: 'a5599aee',
        evidenceUrl: 'https://discord.com/channels/140129091796992000/282173282546089985/863788206067548201',
        date: '2021-07-11',
        collectionDB: 'awards'
    }
]



awardImport.map(awardData => {

    const timestamp = Timestamp.fromDate(new Date(awardData.date + 'T23:59:59.000Z'))

    const award = {
        evidenceCreatedAt: timestamp,
        projectId: awardData.projectId,
        evidenceUrl: awardData.evidenceUrl,
        userId: awardData.userId,
        collectionDB: awardData.collectionDB
    }

    addAward(award)
})

//deleteAwards('XKPQaAR525XV2JsqGn12eEKwxD62')

async function addAward(award) {
    const collection = db.collection('awards')
    await collection.add(award)
}

async function deleteAwards (userId) { //eslint-disable-line
    const docs = await db.collection('awards').where('userId', '==', userId).get()
    docs.forEach(doc => {
        console.log('doc id', doc.id)
        db.collection('awards').doc(doc.id).delete()
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

