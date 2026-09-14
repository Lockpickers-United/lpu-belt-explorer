import axios from 'axios'
import {pathToFileURL} from 'url'

import {jsonIt} from '../../util/jsonIt.js'
import * as userKeys from '../../../keys/users.js'

const defaultProjectId = 'lpu-belt-explorer'
const defaultDatabaseId = '(default)'
const defaultProviderId = 'google.com'
const defaultRequestUri = 'http://localhost'
const defaultTestDocumentPath = 'lockcollections/GGplAdctTfVDLVvYsfIADJmfp8f2'
const defaultBatchDocumentPaths = [
    'lockcollections/GGplAdctTfVDLVvYsfIADJmfp8f2',
    'lockcollections/DQlzrseJbXR5Sw9eBKpmePfSCpk2'
]

const getFirebaseApiKey = () => process.env.FIREBASE_API_KEY || userKeys.firebaseKey
const getIdpProviderId = () => process.env.FIREBASE_IDP_PROVIDER_ID || userKeys.FIREBASE_IDP_PROVIDER_ID || defaultProviderId
const getIdpIdToken = () => process.env.FIREBASE_IDP_ID_TOKEN || userKeys.FIREBASE_IDP_ID_TOKEN || userKeys.GOOGLE_ID_TOKEN
const getIdpAccessToken = () => process.env.FIREBASE_IDP_ACCESS_TOKEN || userKeys.FIREBASE_IDP_ACCESS_TOKEN || userKeys.GOOGLE_ACCESS_TOKEN
const getIdpOauthTokenSecret = () => process.env.FIREBASE_IDP_OAUTH_TOKEN_SECRET || userKeys.FIREBASE_IDP_OAUTH_TOKEN_SECRET
const getIdpRequestUri = () => process.env.FIREBASE_IDP_REQUEST_URI || userKeys.FIREBASE_IDP_REQUEST_URI || defaultRequestUri
const getProjectId = () => process.env.FIREBASE_PROJECT_ID || defaultProjectId
const getDatabaseId = () => process.env.FIRESTORE_DATABASE_ID || defaultDatabaseId

const requireConfigValue = (value, name) => {
    if (!value) {
        throw new Error(`${name} is required`)
    }

    return value
}

const requireIdpToken = ({idToken, accessToken}) => {
    if (!idToken && !accessToken) {
        throw new Error('FIREBASE_IDP_ID_TOKEN or FIREBASE_IDP_ACCESS_TOKEN is required')
    }
}

const getTestAuthConfig = () => ({
    apiKey: requireConfigValue(getFirebaseApiKey(), 'FIREBASE_API_KEY or keys/users.js firebaseKey'),
    providerId: requireConfigValue(getIdpProviderId(), 'FIREBASE_IDP_PROVIDER_ID'),
    requestUri: requireConfigValue(getIdpRequestUri(), 'FIREBASE_IDP_REQUEST_URI'),
    idToken: getIdpIdToken(),
    accessToken: getIdpAccessToken(),
    oauthTokenSecret: getIdpOauthTokenSecret()
})

const buildFirestoreUrl = (documentPath = '') => {
    const safeDocumentPath = documentPath.replace(/^\/+/, '')
    const pathPrefix = safeDocumentPath.startsWith(':') ? '' : '/'

    return `https://firestore.googleapis.com/v1/projects/${getProjectId()}/databases/${getDatabaseId()}/documents${pathPrefix}${safeDocumentPath}`
}

const buildFirestoreDocumentName = (documentPath) => {
    const safeDocumentPath = documentPath.replace(/^\/+/, '')

    return `projects/${getProjectId()}/databases/${getDatabaseId()}/documents/${safeDocumentPath}`
}

const getAuthorizedHeaders = (idToken) => ({
    Authorization: `Bearer ${idToken}`
})

const buildIdpPostBody = ({
                              providerId,
                              idToken,
                              accessToken,
                              oauthTokenSecret
                          }) => {
    requireIdpToken({idToken, accessToken})

    const params = new URLSearchParams({
        providerId
    })

    if (idToken) {
        params.set('id_token', idToken)
    } else {
        params.set('access_token', accessToken)
    }

    if (oauthTokenSecret) {
        params.set('oauth_token_secret', oauthTokenSecret)
    }

    return params.toString()
}

export async function signInWithFirebaseIdpRest({
                                                    apiKey,
                                                    providerId,
                                                    requestUri,
                                                    idToken,
                                                    accessToken,
                                                    oauthTokenSecret
                                                } = getTestAuthConfig()) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`
    const response = await axios.post(url, {
        postBody: buildIdpPostBody({
            providerId,
            idToken,
            accessToken,
            oauthTokenSecret
        }),
        requestUri,
        returnIdpCredential: true,
        returnSecureToken: true
    })

    return {
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        expiresIn: Number(response.data.expiresIn),
        localId: response.data.localId,
        email: response.data.email,
        providerId: response.data.providerId,
        federatedId: response.data.federatedId
    }
}

export const signInWithFirebaseAuthRest = signInWithFirebaseIdpRest

export async function firebaseGetTest(
    collection,
    documentId,
    auth
) {
    const firebaseAuth = auth || await signInWithFirebaseIdpRest()
    const url = buildFirestoreUrl(`${collection}/${documentId}`)
    const response = await axios.get(url, {
        headers: getAuthorizedHeaders(firebaseAuth.idToken)
    })

    jsonIt(response.data)

    return response.data
}

export async function firebaseGetDocumentByPathTest(
    documentPath = defaultTestDocumentPath,
    auth
) {
    const firebaseAuth = auth || await signInWithFirebaseIdpRest()
    const url = buildFirestoreUrl(documentPath)
    const response = await axios.get(url, {
        headers: getAuthorizedHeaders(firebaseAuth.idToken)
    })

    jsonIt(response.data)

    return response.data
}

export async function firebaseGetDocumentByPathNoAuth(
    documentPath = defaultTestDocumentPath,
) {
    const url = buildFirestoreUrl(documentPath)
    console.log('url', url)

    const response = await axios.get(url)

    jsonIt(response.data)

    return response.data
}

export async function firebasePostBatchGetTest(
    documentPaths = defaultBatchDocumentPaths,
    auth
) {
    const firebaseAuth = auth || await signInWithFirebaseIdpRest()
    const url = buildFirestoreUrl(':batchGet')
    const json = {
        documents: documentPaths.map(buildFirestoreDocumentName)
    }
    const response = await axios.post(url, json, {
        headers: {
            ...getAuthorizedHeaders(firebaseAuth.idToken),
            'Content-Type': 'application/json'
        }
    })

    jsonIt(response.data)

    return response.data
}

export async function firebaseAnonSignupTest() {
    const apiKey = requireConfigValue(getFirebaseApiKey(), 'FIREBASE_API_KEY or keys/users.js firebaseKey')

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
    const json = {'returnSecureToken': true}
    const response = await axios.post(url, json, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    jsonIt(response.data)

    return response.data
}

export default async function runFirebaseApiAuthTest() {



    await firebaseGetDocumentByPathNoAuth(defaultTestDocumentPath)


    //await firebaseAnonSignupTest()
    //const auth = await signInWithFirebaseIdpRest()
    //await firebaseGetDocumentByPathTest(defaultTestDocumentPath, auth)
    //await firebasePostBatchGetTest(defaultBatchDocumentPaths, auth)
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
    runFirebaseApiAuthTest().catch((error) => {
        console.error(error.response?.data || error.message || error)
        process.exitCode = 1
    })
}
