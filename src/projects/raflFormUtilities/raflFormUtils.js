import fs from 'node:fs/promises'
import {fetch, CookieJar} from 'node-fetch-cookies'
import dayjs from 'dayjs'

import {sheetIds} from '../../../keys/raflSheetIds.js'
import {localUser, prodUser} from '../../../keys/users.js'

const live = true

const production = process.env.USER !== localUser

const keysDir = production
    ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
    : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`

const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data/`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`

const cookieJar = new CookieJar(keysDir + '/jar.json')


////////////////////////////
// GOOGLE AUTH FUNCTIONS //
//////////////////////////

import {authenticate} from '@google-cloud/local-auth'
import {google} from 'googleapis'

// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/forms.responses.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]
const TOKEN_PATH = `${keysDir}/token-forms.json`
const CREDENTIALS_PATH = `${keysDir}/credentials.json`


//Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH)
        const credentials = JSON.parse(content)
        return google.auth.fromJSON(credentials)
    } catch (err) {
        console.error(err)
        return null
    }
}

//Serializes credentials to a file compatible with GoogleAuth.fromJSON.
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH)
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token
    })
    await fs.writeFile(TOKEN_PATH, payload)
}

//Load or request or authorization to call APIs.
async function authorize() {
    let client = await loadSavedCredentialsIfExist()
    if (client) {
        return client
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH
    })
    if (client.credentials) {
        await saveCredentials(client)
    }
    return client
}


/////////////////////
//   FORM UTILS   //
///////////////////

async function getFormItems(auth, formId) {
    const forms = google.forms({version: 'v1', auth})
    const res = await forms.forms.get({
        formId: formId
    })
    return res.data.items
}

async function getFormCharities(auth, formId) {
    const forms = google.forms({version: 'v1', auth})
    const res = await forms.forms.get({
        formId: formId
    })
    const formItems = res.data.items
    const charitiesItem = formItems?.find(item => item.title === 'Selected charity')
    return charitiesItem?.questionItem.question.choiceQuestion.options
}

export async function getCharities(auth, formId) {
    const charities = await getFormCharities(auth, formId)
    return charities ? charities : [{error: 'getCharities error'}]
}

async function deleteAllQuestions(auth, formId, reset) {

    if (live) return {warning: 'RAFL is live, action canceled'}
    if (!reset) return 'reset is off, canceling'

    const forms = google.forms({version: 'v1', auth})
    const form = await forms.forms.get({
        formId: formId
    })

    if (form?.data?.items) {
        const requests = form.data.items.map(() => {
            return {'deleteItem': {'location': {'index': 0}}}
        })
        const updateResponse = await forms.forms.batchUpdate({
            formId: formId,
            requestBody: {requests: requests}
        })
        return updateResponse.data
    }
}


async function createQuestions(auth, formId, raflData, charitiesData, reset) {

    if (live) return {warning: 'RAFL is live, action canceled'}
    if (!reset) return 'reset is off, canceling'

    console.log('creating questions')

    const forms = google.forms({version: 'v1', auth})

    const dropDownQuestion = ((title, options, location) => [
        {
            'createItem': {
                'item': {
                    'title': (
                        title
                    ),
                    'questionItem': {
                        'question': {
                            'required': true,
                            'choiceQuestion': {
                                'type': 'DROP_DOWN',
                                'options': options
                            }
                        }
                    }
                },
                'location': {'index': location}
            }
        }
    ])


    const platformQuestion = dropDownQuestion(
        'Your Preferred Platform',
        [
            {'value': 'Discord'},
            {'value': 'Reddit'}
        ],
        0)

    const requests = [platformQuestion]

    const usernameQuestion = textQuestion('Platform Username', 1)
    requests.push(usernameQuestion)

    const charityQuestion =
        dropDownQuestion(
            'Selected charity',
            charitiesData.map(charity => {
                    return {'value': charity.name}
                }
            )
            ,
            2)
    requests.push(charityQuestion)

    const receiptQuestion = textQuestion('Receipt from approved charity (hosted image link, must contain a visible date)', 3)
    requests.push(receiptQuestion)

    const donationQuestion = textQuestion('Total donation in USD', 4)
    requests.push(donationQuestion)

    const potQuestions =
        raflData
            .sort((a, b) => {
                return parseInt(a.potNumber) - parseInt(b.potNumber)
                    || a.title.localeCompare(b.title)
            })
            .filter(pot => pot.potNumber !== '99')
            .map((pot, index) =>
                textQuestion(`Pot ${pot.potNumber} - ${pot.title}`, requests.length + index)
            )
    requests.push(...potQuestions)

    jsonIt('requests', requests)

    const updateResponse = await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {requests: requests}
    })
    return updateResponse.data
}

async function addQuestions(auth, formId, raflData) {

    if (live) return {warning: 'RAFL is live, action canceled'}

    const formItems = await getFormItems(auth, formId)
    let nextIndex = formItems.length

    const potQuestions =
        raflData
            .filter(pot => pot.potNumber !== '99')
            .sort((a, b) => {
                return parseInt(a.potNumber) - parseInt(b.potNumber)
                    || a.title.localeCompare(b.title)
            })
            .map((pot) => {
                    if (!formItems.find(fpot => fpot.title.includes(pot.title))) {
                        const q = textQuestion(`Pot ${pot.potNumber} - ${pot.title}`, nextIndex)
                        nextIndex++
                        return q
                    }
                }
            )
            .filter(x => x)

    if (potQuestions.length > 0) {
        const forms = google.forms({version: 'v1', auth})
        const updateResponse = await forms.forms.batchUpdate({
            formId: formId,
            requestBody: {requests: potQuestions}
        })
        return updateResponse.data
    } else {
        return {warning: 'No questions to add'}
    }
}

async function buildQuestionMap(raflData) {

    // usual fetch usage, except with one or multiple cookie jars as first parameter
    const formSourceFetch = await fetch(cookieJar, `https://docs.google.com/forms/d/e/${sheetIds.raflViewFormId}/viewform`)

    // save the received cookies to disk
    await cookieJar.save()

    const formSource = await formSourceFetch.text()
    const regex = /FB_PUBLIC_LOAD_DATA_ = (.*);<\/script>/g
    const exec = regex.exec(formSource)

    if (!exec) return {error: 'buildQuestionMap error: exec failed, no form data found'}

    const questionData = JSON.parse(exec[1])[1][1]

    const questionMap = questionData.map((q, index) => {
        const questionPotTitle = q[1].replace(/Pot.*- /, '')
        const pot = raflData.find(pot => pot.title === questionPotTitle)
        return {
            text: q[1],
            formId: q[4][0][0],
            index: index,
            potId: pot?.id
        }
    })

    await fs.writeFile(`${serverDir}/raflQuestionMap.json`, JSON.stringify(questionMap, null, 2), function (err) {
        if (err) {
            console.error('save questionMap error:', err)
        }
    })

    return questionMap
}


export async function getFormResponses(auth, formId) {

    const formItems = await getFormItems(auth, formId)
    const questionMap = formItems.reduce((acc, item) => {
        acc[item.questionItem.question.questionId] = item.title
        return acc
    }, {})

    const forms = google.forms({version: 'v1', auth})
    const responses = (await forms.forms.responses.list({
        formId: formId
    })).data.responses

    return responses?.length > 0
        ? responses.map(res => {
            return Object.keys(res.answers).reduce((acc, key) => {
                if (questionMap[key] === 'Your Preferred Platform') {
                    acc.platform = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Platform Username') {
                    acc.username = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Selected charity') {
                    acc.charity = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Receipt from approved charity (hosted image link, must contain a visible date)') {
                    acc.receipt = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Total donation in USD') {
                    acc.donation = parseInt(res.answers[key].textAnswers.answers[0].value)
                } else {
                    acc.pots = acc.pots
                        ? {...acc.pots, [questionMap[key]]: parseInt(res.answers[key].textAnswers.answers[0].value)}
                        : {[questionMap[key]]: parseInt(res.answers[key].textAnswers.answers[0].value)}
                }
                acc.donor = `${acc.platform}-${acc.username}`
                acc.lastSubmittedTime = res.lastSubmittedTime
                return acc
            }, {})
        })
        : []

}

async function getSheetsResponses(auth, raflStatsId) {
    const service = google.sheets({version: 'v4', auth})
        const range = 'Review!A:ZZ'
        const result = await service.spreadsheets.values.get({
            spreadsheetId: raflStatsId,
            range: range
        })
        const [headers, ...rows] = result.data.values
        let items = []
        rows.forEach(function (row) {
            let obj = {}
            row.forEach(function (c, j) {
                obj[headers[j]] = c
            })
            items.push(obj)
        })
        return items
}

async function processSheetsResponses(sheetResponses, raflData) {

    const summaryData = sheetResponses.reduce((acc, res) => {
        acc = acc ? acc : {}
        if (res['Good to go'] !== 'TRUE') return acc

        let platform = res['Platform']
        let donor = `${platform}-${res['Name or Email']}`
        let donation = parseInt(res['Donation'])
        let charity = res['Charity Name']
        let belt = res['Belt']

        setDeepAdd(acc, ['totalDonations'], donation)
        setDeepAdd(acc, ['totalDonorCount'], 1)
        setDeepUnique(acc, ['uniqueValues', 'totalDonorsUnique'], donor)
        setDeep(acc, ['totalDonorCountUnique'], acc.uniqueValues.totalDonorsUnique.length)

        setDeepAdd(acc, ['platformDonations', platform], donation)
        setDeepAdd(acc, ['platformDonorCount', platform], 1)
        setDeepUnique(acc, ['uniqueValues', 'platformDonorsUnique', platform], donor)
        setDeep(acc, ['platformDonorCountUnique', platform], acc.uniqueValues.platformDonorsUnique[platform].length)

        setDeepAdd(acc, ['charityDonations', charity], donation)
        setDeepAdd(acc, ['charityDonorCount', charity], 1)
        setDeepUnique(acc, ['uniqueValues', 'charityDonorsUnique', charity], donor)
        setDeep(acc, ['charityDonorCountUnique', charity], acc.uniqueValues.charityDonorsUnique[charity].length)

        setDeepAdd(acc, ['beltDonations', belt], donation)
        setDeepUnique(acc, ['uniqueValues', 'beltDonorsUnique', belt], donor)
        setDeep(acc, ['beltDonorCountUnique', belt], acc.uniqueValues.beltDonorsUnique[belt].length)

        Object.keys(res)
            .filter(key => (/Pot/.test(key) && res[key] !== ''))
            .map(key => {
                const potId = getPotIdFromNumber(key, raflData)
                setDeepAdd(acc, ['potTickets', potId], parseInt(res[key]))
                setDeepAdd(acc, ['potDonorCount', potId], 1)

                setDeepUnique(acc, ['uniqueValues', 'potDonorsUnique', potId], donor)
                setDeep(acc, ['potDonorCountUnique', potId], acc.uniqueValues.potDonorsUnique[potId].length)


            })

        return acc
    }, {})

    if (summaryData?.uniqueValues) delete summaryData.uniqueValues

    const detailedData = sheetResponses?.reduce((acc, res) => {
        acc = acc ? acc : {}
        if (res['Good to go'] !== 'TRUE') return acc

        const date = dayjs(res['Date']).format('YYYY-MM-DD')

        let platform = res['Platform']
        let donor = `${platform}-${res['Name or Email']}`
        let donation = parseInt(res['Donation'])
        let charity = res['Charity Name']

        setDeepUnique(acc, ['uniqueValues', 'cumDonorsUnique'], donor)
        setDeep(acc, [date, 'cumDonorsUnique'], acc.uniqueValues.cumDonorsUnique.length)

        setDeepAdd(acc, [date, 'totalDonations'], donation)
        setDeepAdd(acc, [date, 'totalDonors'], 1)
        setDeepUnique(acc, ['uniqueValues', date, 'totalDonorsUnique'], donor)
        setDeep(acc, [date, 'totalDonorCountUnique'], acc.uniqueValues[date].totalDonorsUnique.length)

        setDeepAdd(acc, [date, 'platforms', platform, 'donations'], donation)
        setDeepAdd(acc, [date, 'platforms', platform, 'donors'], 1)
        setDeepUnique(acc, ['uniqueValues', date, 'platformDonorsUnique', platform], donor)
        setDeep(acc, [date, 'platforms', platform, 'donorsUnique'], acc.uniqueValues[date].platformDonorsUnique[platform].length)

        setDeepAdd(acc, [date, 'charities', charity, 'donations'], donation)
        setDeepAdd(acc, [date, 'charities', charity, 'donors'], 1)
        setDeepUnique(acc, ['uniqueValues', date, 'charityDonorsUnique', charity], donor)
        setDeep(acc, [date, 'charities', charity, 'donorsUnique'], acc.uniqueValues[date].charityDonorsUnique[charity].length)

        Object.keys(res)
            .filter(key => (/Pot/.test(key) && res[key] !== ''))
            .map(key => {
                const potId = getPotIdFromNumber(key, raflData)
                setDeepAdd(acc, [date, 'pots', potId, 'tickets'], parseInt(res[key]))
                setDeepAdd(acc, [date, 'pots', potId, 'donors'], 1)

                setDeepUnique(acc, ['uniqueValues', date, 'potDonorsUnique', potId], donor)
                setDeep(acc, [date, 'pots', potId, 'donorsUnique'], acc.uniqueValues[date].potDonorsUnique[potId].length)

            })

        return acc

    }, {})

    if (detailedData?.uniqueValues) delete detailedData.uniqueValues

    const metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}

    const raflResponseDetails = { summaryData, detailedData, metadata }
    await fs.writeFile(`${serverDir}/raflResponseDetails.json`, JSON.stringify(raflResponseDetails, null, 2), function (err) {
        if (err) {
            console.error('save raflResponseDetails error:', err)
        }
    })


    return raflResponseDetails

}

function getPotIdFromNumber(title, raflData) {
    const potTitle = title.replace(/Pot \d+ - /, '')
    const potNum = title.match(/Pot (\d+)/)
    const pot = potNum ? raflData.find(p => p.potNumber === potNum[1]) : null
    return pot ? pot.id : potTitle
}


///////////////////////////////////////
//              MAIN                 //
///////////////////////////////////////

export async function raflUtils(util) {

    // TODO: why from explore.lpubelts.com??
    //const fullRaflData = await (await fetch(cookieJar, 'https://explore.lpubelts.com/data/rafl.json')).json()
    //const raflDataPreview = fullRaflData.filter(x => x.year === 2025)

    let prodRaflData = await (await fetch(cookieJar, 'https://lpubelts.com/rafl.json')).json()
    const raflData = prodRaflData.filter(x => x.year === 2025)

    const charitiesData = await (await fetch(cookieJar, 'https://lpubelts.com/raflCharities.json')).json()

    const {raflMainFormId: formId, raflStatsId} = sheetIds
    const auth = await authorize()

    let response
    if (util === 'getFormItems') response = await getFormItems(auth, formId)
    if (util === 'getCharities') response = await getCharities(auth, formId)
    if (util === 'buildQuestionMap') response = await buildQuestionMap(raflData)

    //if (util === 'raflResponseSummary') response = await getFormResponses(auth, formId, raflData)
    //if (util === 'processResponses') response = await processResponses()

    if (util === 'addQuestions') {
        const addQuestionsResponse = await addQuestions(auth, formId, raflData)
        if (!addQuestionsResponse.warning && !addQuestionsResponse.error) {
            const buildQuestionMapResponse = await buildQuestionMap(raflData)
            response = {addQuestionsResponse, buildQuestionMapResponse}
        } else {
            response = addQuestionsResponse
        }
    }

    if (util === 'getSheetsResponses') {
        response = await getSheetsResponses(auth, raflStatsId)
    }

    if (util === 'getFormResponses') {
        response = await getFormResponses(auth, formId)
    }

    if (util === 'processSheetsResponses') {
        const sheetResponses = await getSheetsResponses(auth, raflStatsId)
        response = await processSheetsResponses(sheetResponses, raflData)
    }

    if (util === 'getRaflData') {
        return raflData
    }

    // DANGER //

    // only set this to true if you *really* want to delete the questions and rebuild!
    const reset = false

    if (util === 'createQuestions') {
        if (reset && !live) {
            await createQuestions(auth, formId, raflData, charitiesData, reset)
            //response = await buildQuestionMap(raflData)
        } else {
            return 'rafl is live and/or reset is off, action canceled'
        }
    }

    if (util === 'deleteAllQuestions') {
        if (reset && !live) {
            await deleteAllQuestions(auth, formId, reset)
            response = await buildQuestionMap(raflData)
        } else {
            return 'rafl is live and/or reset is off, action canceled'
        }
    }

    if (util === 'rebuildForm') {
        if (reset && !live) {
            //const deleteAllResponse = await deleteAllQuestions(auth, formId, reset)
            //const createQuestionsResponse = await createQuestions(auth, formId, raflData, charitiesData, reset)
            //jsonIt('createQuestionsResponse', createQuestionsResponse)
            response = await buildQuestionMap(raflData)
        } else {
            return 'rafl is live and/or reset is off, action canceled'
        }
    }

    return response

}

////// ONE-TIME COMMAND //////

//await raflUtils('getCharities').then(r => {if (!production) jsonIt('response', r)})


///////////////////////////////////////
//            HELPERS                //
///////////////////////////////////////


function textQuestion(title, location) {
    return [
        {
            'createItem': {
                'item': {
                    'title': (
                        title
                    ),
                    'questionItem': {
                        'question': {
                            'textQuestion': {}
                        }
                    }
                },
                'location': {'index': location}
            }
        }
    ]
}

function setDeep(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = value
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeep(obj[key], path.slice(1), value)
}

function setDeepUnique(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = obj[path[0]]
            ? [...new Set([...obj[path[0]], value])]
            : [value]
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeepUnique(obj[key], path.slice(1), value)
}

function setDeepAdd(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = obj[path[0]] ? obj[path[0]] + value : value
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeepAdd(obj[key], path.slice(1), value)
}

function jsonIt(string, object) {
    console.log(string)
    console.log(JSON.stringify(object, null, 2))
    console.log('--------')
}