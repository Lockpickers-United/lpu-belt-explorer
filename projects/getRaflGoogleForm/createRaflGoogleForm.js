import fs from 'node:fs/promises'
import fetch from 'node-fetch'

const production = process.env.USER === 'dh_m5s5pf'

const keysDir = production
    ? '/home/dh_m5s5pf/explore-lpubelts-com-node/keys'
    : '/Users/nealbayless/Documents/GitHub/explore-lpubelts-com-node/keys'

// MAIN DATA OBJECT
let error = false

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
        error = true
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
    const charities = charitiesItem?.questionItem.question.choiceQuestion.options

    console.log('charities', JSON.stringify(charities, null, 2))

    return charities

}


async function deleteAllQuestions(auth, formId) {

    const forms = google.forms({version: 'v1', auth})
    const form = await forms.forms.get({
        formId: formId
    })

    const requests = form.data.items.map(() => {
        return {'deleteItem': {'location': {'index': 0}}}
    })

    const updateResponse = await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {requests: requests}
    })
    console.log(updateResponse.data)
}

async function createQuestions(auth, formId, raflData, charitiesData) {

    const forms = google.forms({version: 'v1', auth})

    const textQuestion = ((title, location) =>
            [
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
    )

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
            .filter(pot => pot.potNumber !== '99')
            .map((pot, index) =>
                textQuestion(`Pot ${index + 1} - ${pot.title}`, requests.length + index)
            )

    requests.push(...potQuestions)


    const updateResponse = await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {requests: requests}
    })
    console.log(updateResponse.data)
    return updateResponse.data
}


async function getFormResponses(auth, formId) {

    const formItems = await getFormItems(auth, formId)
    const questionMap = formItems.reduce((acc, item) => {
        acc[item.questionItem.question.questionId] = item.title
        return acc
    }, {})

    const forms = google.forms({version: 'v1', auth})
    const responses = (await forms.forms.responses.list({
        formId: formId
    })).data.responses

    //jsonIt(questionMap)
    //jsonIt(formItems)
    jsonIt(responses)

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
                return acc
            }, {})
        }
    )

    console.log('responseData', responseData)

    const summaryData = responseData.reduce((acc, res) => {

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



    console.log('summaryData', summaryData)
}

///////////////////////////////////////
//              MAIN                 //
///////////////////////////////////////

(async function () {

    const raflFetch = await fetch('https://lpubelts.com/rafl.json')
    const raflData = await raflFetch.json()

    const charitiesFetch = await fetch('https://lpubelts.com/raflCharities.json')
    const charitiesData = await charitiesFetch.json()

    const formId = '1_k_xv0hv-EkVSTTXLLfw6Vt5O4JXirYCRQrazWHDBko'

    const auth = await authorize()

    //await getFormItems(auth, formId)

    //await getCharities(formId)

    //await deleteAllQuestions(auth, formId)
    //await createQuestions(auth, formId, raflData, charitiesData)

    await getFormResponses(auth, formId)

})()

export async function getCharities(formId) {
    const auth = await authorize()
    const charities = await getFormCharities(auth, formId)
    return charities ? charities : [{error: 'error'}]
}

function jsonIt(object) {
    console.log(JSON.stringify(object, null, 2))
    console.log('--------')
}