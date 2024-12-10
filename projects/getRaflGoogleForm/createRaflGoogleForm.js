import fs from 'node:fs/promises'
import fetch from 'node-fetch'

const production = process.env.USER === 'dh_wk2wdh'
const serverDir = production
    ? '/home/dh_wk2wdh/lpulocks.com'
    : '/Users/nealbayless/Documents/GitHub/lock-trackers/public'

const serverDirBeta = production
    ? '/home/dh_wk2wdh/lpulocks.com.beta'
    : '/Users/nealbayless/Documents/GitHub/google-sheets-api/'

const workDir = production
    ? '/home/dh_wk2wdh/sheets'
    : '/Users/nealbayless/Documents/GitHub/google-sheets-api'

const keysDir = production
    ? '/home/dh_wk2wdh/sheets'
    : '/Users/nealbayless/Documents/GitHub/explore-lpubelts-com-node/keys'

// MAIN DATA OBJECT
let error = false

import {authenticate} from '@google-cloud/local-auth'
import {google} from 'googleapis'
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/forms.body']
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


async function getGoogleForm(auth) {

    const formId = '1_k_xv0hv-EkVSTTXLLfw6Vt5O4JXirYCRQrazWHDBko'
    const forms = google.forms({version: 'v1', auth})
    const res = await forms.forms.get({
        formId: formId
    })

    const charities = JSON.stringify(res.data, null, 2)

    console.log('res', charities)

}

async function createQuestions(auth, raflData, charitiesData) {

    const formId = '1_k_xv0hv-EkVSTTXLLfw6Vt5O4JXirYCRQrazWHDBko'
    const forms = google.forms({version: 'v1', auth})
    const res = await forms.forms.get({
        formId: formId
    })

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

///////////////////////////////////////
//              MAIN                 //
///////////////////////////////////////

(async function () {

    const raflFetch = await fetch('https://lpubelts.com/rafl.json')
    const raflData = await raflFetch.json()
    //console.log('raflData', raflData)

    const charitiesFetch = await fetch('https://lpubelts.com/raflCharities.json')
    const charitiesData = await charitiesFetch.json()
    //console.log('charitiesData', charitiesData)

    const auth = await authorize()

    await getGoogleForm(auth)

    await createQuestions(auth, raflData, charitiesData)


})()
