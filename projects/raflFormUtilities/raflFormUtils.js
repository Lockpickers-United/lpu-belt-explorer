import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import dayjs from 'dayjs'

const production = process.env.USER !== 'nealbayless'

const keysDir = production
    ? '/home/dh_m5s5pf/explore-lpubelts-com-node/keys'
    : '/Users/nealbayless/Documents/GitHub/explore-lpubelts-com-node/keys'

const serverDir = production
    ? '/home/dh_m5s5pf/explore.lpubelts.com/public/data/'
    : '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL'

const archiveDir = production
    ? '/home/dh_m5s5pf/rafl-stats-archive/'
    : '/Users/nealbayless/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL/rafl-stats-archive'

////////////////////////////
// GOOGLE AUTH FUNCTIONS //
//////////////////////////

import {authenticate} from '@google-cloud/local-auth'
import {google} from 'googleapis'
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/forms.body', 'https://www.googleapis.com/auth/forms.responses.readonly']
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
        console.log(updateResponse.data)
        return updateResponse.data
    }
}


async function createQuestions(auth, formId, raflData, charitiesData, reset) {

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

    jsonIt('potQuestions', potQuestions)

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

    if (responses?.length > 0) {
        const responseData = responses.map(res => {
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

        const summaryData = responseData?.reduce((acc, res) => {

            acc.totalDonorCount = acc.totalDonorCount + 1 || 1

            acc.uniqueDonors = acc.uniqueDonors
                ? [...new Set([...acc.uniqueDonors, res.donor])]
                : [res.donor]
            acc.uniqueDonorCount = acc.uniqueDonors.length

            acc.totalDonations = acc.totalDonations + res.donation || res.donation

            acc.platformDonations = acc.platformDonations ? acc.platformDonations : {}
            acc.platformDonations[res.platform] = acc.platformDonations[res.platform] + res.donation
                || res.donation

            acc.platformDonors = acc.platformDonors ? acc.platformDonors : {}
            acc.platformDonors[res.platform] = acc.platformDonors[res.platform]
                ? [...new Set([...acc.platformDonors[res.platform], res.donor])]
                : [res.donor]
            acc.platformDonorCount = acc.platformDonorCount ? acc.platformDonorCount : {}
            acc.platformDonorCount[res.platform] = acc.platformDonors[res.platform].length

            acc.charityDonations = acc.charityDonations ? acc.charityDonations : {}
            acc.charityDonations[res.charity] = acc.charityDonations[res.charity] + res.donation
                || res.donation
            acc.charityDonations['total'] = acc.charityDonations['total'] + res.donation
                || res.donation

            acc.charityDonors = acc.charityDonors ? acc.charityDonors : {}
            acc.charityDonors[res.charity] = acc.charityDonors[res.charity]
                ? [...new Set([...acc.charityDonors[res.charity], res.donor])]
                : [res.donor]
            acc.charityDonorCount = acc.charityDonorCount ? acc.charityDonorCount : {}
            acc.charityDonorCount[res.charity] = acc.charityDonors[res.charity].length

            acc.potTickets = acc.potTickets ? acc.potTickets : {}
            acc.potDonors = acc.potDonors ? acc.potDonors : {}

            Object.keys(res.pots).map(key => {
                acc.potTickets[key] = acc.potTickets[key] + res.pots[key] || res.pots[key]
                acc.potTickets['total'] = acc.potTickets['total'] + res.pots[key] || res.pots[key]

                acc.potDonors[key] = acc.potDonors[key]
                    ? [...new Set([...acc.potDonors[key], res.donor])]
                    : [res.donor]
                acc.potDonorCount = acc.potDonorCount ? acc.potDonorCount : {}
                acc.potDonorCount[key] = acc.potDonors[key].length

            })

            return acc

        }, {})


        const detailedData = responseData?.reduce((acc, res) => {
            const date = dayjs(res.lastSubmittedTime).format('YYYY-MM-DD')

            setDeepAdd(acc, [date, 'totalDonors'], 1)
            setDeepAdd(acc, [date, 'totalDonations'], res.donation)
            setDeepAdd(acc, [date, 'platforms', res.platform, 'donors'], 1)
            setDeepAdd(acc, [date, 'platforms', res.platform, 'donations'], res.donation)
            setDeepAdd(acc, [date, 'charities', res.charity, 'donors'], 1)
            setDeepAdd(acc, [date, 'charities', res.charity, 'donations'], res.donation)
            Object.keys(res.pots).forEach(key => {
                setDeepAdd(acc, [date, 'pots', key, 'tickets'], res.pots[key])
                setDeepAdd(acc, [date, 'pots', key, 'donors'], 1)
            })

            return acc

        }, {})


        delete summaryData.uniqueDonors
        delete summaryData.platformDonors
        delete summaryData.charityDonors
        delete summaryData.potDonors
        summaryData.status = 'success'

        let dateString = dayjs().format('YYYY-MM-DD')

        await fs.writeFile(`${serverDir}/raflResponseDetails.json`, JSON.stringify(detailedData, null, 2), function (err) {
            if (err) {
                console.error('save raflResponseDetails error:', err)
            }
        })

        await fs.writeFile(`${serverDir}/raflResponseSummary.json`, JSON.stringify(summaryData, null, 2), function (err) {
            if (err) {
                console.error('save raflResponseSummary error:', err)
            }
        })

        await fs.writeFile(`${archiveDir}/raflResponseSummary-${dateString}.json`, JSON.stringify(summaryData, null, 2), function (err) {
            if (err) {
                console.error('archive raflResponseSummary error:', err)
            }
        })

        return summaryData
    }

    return {'warning': 'no form responses found'}
}


async function buildQuestionMap(raflData) {

    const formSourceFetch = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSe0Rr8mykkE5FAgzUACzGsGYq_mN-vS34arr2uL0QDEFHBSNQ/viewform')
    const formSource = await formSourceFetch.text()

    const regex = /var FB_PUBLIC_LOAD_DATA_ = (.*);<\/script>/g
    const exec = regex.exec(formSource)
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

async function processResponses() {

    try {
        let filenames = (await fs.readdir(archiveDir))
            .filter(filename => filename.endsWith('.json'))
        const responses = []
        //console.log('filenames', filenames)

        for (const item of filenames) {
            const date = /.*-(\d{4}-\d{2}-\d{2})/.exec(item)[1]
            await fs.readFile(`${archiveDir}/${item}`, 'utf8').then((data) => {
                const dateResponses = JSON.parse(data)
                dateResponses.date = date
                responses.push(dateResponses)
            })
        }
        await fs.writeFile(`${serverDir}/raflHistoricalResponses.json`, JSON.stringify(responses, null, 2), function (err) {
            if (err) {
                console.error('save raflHistoricalResponses error:', err)
            }
        })

        return responses

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Directory not found:', error.message)
        } else if (error.code === 'EACCES') {
            console.error('Permission denied:', error.message)
        } else {
            console.error('Error reading directory:', error.message)
        }

        return {status: 'error', message: error.message}

    }
}


///////////////////////////////////////
//              MAIN                 //
///////////////////////////////////////

export async function raflUtils(util) {

    const raflData = await (await fetch('https://lpubelts.com/rafl.json')).json()
    const charitiesData = await (await fetch('https://lpubelts.com/raflCharities.json')).json()

    const formId = '1_k_xv0hv-EkVSTTXLLfw6Vt5O4JXirYCRQrazWHDBko'
    const auth = await authorize()

    let response

    if (util === 'getFormItems') response = await getFormItems(auth, formId)
    if (util === 'getCharities') response = await getCharities(auth, formId)
    if (util === 'buildQuestionMap') response = await buildQuestionMap(raflData)
    if (util === 'raflResponseSummary') response = await getFormResponses(auth, formId, raflData)
    if (util === 'processResponses') response = await processResponses()
    if (util === 'addQuestions') {
        const addQuestionsResponse = await addQuestions(auth, formId, raflData)
        if (!addQuestionsResponse.warning && !addQuestionsResponse.error) {
            const buildQuestionMapResponse = await buildQuestionMap(raflData)
            response = {addQuestionsResponse, buildQuestionMapResponse}
        } else {
            response = addQuestionsResponse
        }
    }

    //jsonIt('response', response)


    // DANGER //

    // only set this to true if you *really* want to delete the questions and rebuild!
    const reset = false

    if (util === 'rebuildForm' && reset) {
        const deleteAllResponse = await deleteAllQuestions(auth, formId, reset)
        const createQuestionsResponse = await createQuestions(auth, formId, raflData, charitiesData, reset)
        //jsonIt('createQuestionsResponse', createQuestionsResponse)
        response = await buildQuestionMap(raflData)
    }

    //await createQuestions(auth, formId, raflData, charitiesData, true)

    return response

}

//await raflUtils('processResponses')


////// HELPERS //////

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