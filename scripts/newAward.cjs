const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp, 'lpubelts-dev')

const awardImport = [
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '249dd56f',
        'description': 'Orange',
        'date': '2022-06-28',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/991220403240456202'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '8ad90321',
        'description': 'Green',
        'date': '2022-08-06',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1005539603089981460'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '39d91da5',
        'description': 'Blue',
        'date': '2022-09-29',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1025026216484421735'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '893d378f',
        'description': 'Purple',
        'date': '2022-10-06',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1027803402819874836'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': 'b8e10620',
        'description': 'Brown',
        'date': '2022-11-30',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1047742802894802984'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': 'da7759a9',
        'description': 'Black',
        'date': '2023-10-12',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282170926064336907/1162106114540830801'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '80e8bd11',
        'description': '2nd',
        'date': '2024-01-03',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1192301864788693013'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '3a71ab4c',
        'description': '3rd',
        'date': '2024-04-26',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1226354894911570001'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': 'c3a1b4e6',
        'description': '4th',
        'date': '2024-08-21',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1275832191263182900'
    },
    {
        'userId': 'WMSvvuutyShfvBBYB3PmDe4fmeS2',
        'matchId': '46366349',
        'description': '5th',
        'date': '2024-08-24',
        'awardUrl': 'https://discord.com/channels/140129091796992000/282173282546089985/1276876549806882856'
    }
]



awardImport.map(awardData => {
    const award = {
        date: awardData.date + 'T00:00:00.000Z',
        matchId: awardData.matchId,
        awardUrl: awardData.awardUrl,
        userId: awardData.userId
    }
    addAward(award)
})


async function addAward(award) {
    const collection = db.collection('awards')
    await collection.add(award)
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

