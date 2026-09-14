import axios from 'axios'
import {randomBytes} from 'node:crypto'
import {spawn} from 'node:child_process'
import {createServer} from 'node:http'
import {platform} from 'node:os'
import {pathToFileURL} from 'node:url'

import {jsonIt} from '../../util/jsonIt.js'
import * as userKeys from '../../../keys/users.js'

const defaultProjectId = 'lpu-belt-explorer'
const defaultDatabaseId = '(default)'
const defaultProviderId = 'google.com'
const defaultRequestUri = 'http://localhost'
const defaultFirebaseAuthTimeoutMs = 5 * 60 * 1000
const firebaseBrowserSdkVersion = '12.19.0'
const defaultTestDocumentPath = 'lockcollections/GGplAdctTfVDLVvYsfIADJmfp8f2'
const defaultBatchDocumentPaths = [
    'lockcollections/GGplAdctTfVDLVvYsfIADJmfp8f2',
    'lockcollections/DQlzrseJbXR5Sw9eBKpmePfSCpk2'
]

const getFirebaseApiKey = () => process.env.FIREBASE_API_KEY || userKeys.firebaseKey
const getFirebaseAuthIdToken = () => process.env.FIREBASE_AUTH_ID_TOKEN
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

const getFirebaseAuth = async (auth) => {
    if (auth) return auth

    const idToken = getFirebaseAuthIdToken()
    if (idToken) return {idToken}

    return signInWithInteractiveGoogle()
}

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

const htmlEncodeJson = (value) => JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')

const buildFirebaseSignInPage = ({firebaseConfig, callbackUrl}) => `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Firebase API test sign-in</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 34rem; padding: 0 1rem; }
        button { cursor: pointer; font: inherit; padding: 0.7rem 1rem; }
        #status { margin-top: 1rem; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>Firebase API test</h1>
    <p>Sign in with the account whose Firestore access you want to test.</p>
    <button id="sign-in" type="button">Sign in with Google</button>
    <p id="status" role="status"></p>
    <script type="module">
        import {initializeApp} from 'https://www.gstatic.com/firebasejs/${firebaseBrowserSdkVersion}/firebase-app.js'
        import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/${firebaseBrowserSdkVersion}/firebase-auth.js'

        const firebaseConfig = ${htmlEncodeJson(firebaseConfig)}
        const callbackUrl = ${htmlEncodeJson(callbackUrl)}
        const button = document.querySelector('#sign-in')
        const status = document.querySelector('#status')
        const auth = getAuth(initializeApp(firebaseConfig))
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})

        async function reportResult(body) {
            const response = await fetch(callbackUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('The local authentication callback failed')
        }

        button.addEventListener('click', async () => {
            button.disabled = true
            status.textContent = 'Waiting for Google sign-in...'

            try {
                const credential = await signInWithPopup(auth, provider)
                const idToken = await credential.user.getIdToken(true)
                await reportResult({idToken})
                status.textContent = 'Authentication complete. You may close this window.'
            } catch (error) {
                status.textContent = error.message || String(error)
                button.disabled = false
                await reportResult({error: status.textContent}).catch(() => {})
            }
        })
    </script>
</body>
</html>`

const openSystemBrowser = async (url) => {
    const commands = {
        darwin: ['open', [url]],
        linux: ['xdg-open', [url]],
        win32: ['cmd.exe', ['/d', '/s', '/c', 'start', '', url]]
    }
    const [command, args] = commands[platform()] || []

    if (!command) {
        throw new Error(`Unable to open a browser on this platform. Open this URL manually: ${url}`)
    }

    await new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            detached: true,
            stdio: 'ignore'
        })
        child.once('error', reject)
        child.once('spawn', () => {
            child.unref()
            resolve()
        })
    })
}

const readJsonRequest = async (request) => {
    const chunks = []
    let size = 0

    for await (const chunk of request) {
        size += chunk.length
        if (size > 16 * 1024) throw new Error('Authentication callback was too large')
        chunks.push(chunk)
    }

    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const closeServer = (server) => new Promise((resolve) => server.close(resolve))

export async function signInWithInteractiveGoogle({
                                                       apiKey = getFirebaseApiKey(),
                                                       projectId = getProjectId(),
                                                       browserOpen = openSystemBrowser,
                                                       timeoutMs = defaultFirebaseAuthTimeoutMs
                                                   } = {}) {
    requireConfigValue(apiKey, 'FIREBASE_API_KEY or keys/users.js firebaseKey')
    requireConfigValue(projectId, 'FIREBASE_PROJECT_ID')

    const nonce = randomBytes(24).toString('hex')
    const signInPath = `/firebase-auth/${nonce}`
    const callbackPath = `${signInPath}/callback`
    let localOrigin
    let settleToken
    let rejectToken
    let settled = false
    const tokenPromise = new Promise((resolve, reject) => {
        settleToken = resolve
        rejectToken = reject
    })
    const settle = (callback, value) => {
        if (settled) return
        settled = true
        callback(value)
    }
    const server = createServer((request, response) => {
        const requestUrl = new URL(request.url, localOrigin)

        if (request.method === 'GET' && requestUrl.pathname === signInPath) {
            response.writeHead(200, {
                'Cache-Control': 'no-store',
                'Content-Type': 'text/html; charset=utf-8',
                'X-Content-Type-Options': 'nosniff'
            })
            response.end(buildFirebaseSignInPage({
                firebaseConfig: {
                    apiKey,
                    authDomain: `${projectId}.firebaseapp.com`,
                    projectId
                },
                callbackUrl: `${localOrigin}${callbackPath}`
            }))
            return
        }

        if (request.method === 'POST' && requestUrl.pathname === callbackPath) {
            if (request.headers.origin !== localOrigin) {
                response.writeHead(403).end('Invalid callback origin')
                return
            }

            readJsonRequest(request)
                .then(({idToken, error}) => {
                    if (error) throw new Error(`Google sign-in failed: ${error}`)
                    if (typeof idToken !== 'string' || !idToken) {
                        throw new Error('Firebase sign-in did not return an ID token')
                    }

                    response.writeHead(204).end()
                    settle(settleToken, idToken)
                })
                .catch((error) => {
                    response.writeHead(400).end('Invalid authentication callback')
                    settle(rejectToken, error)
                })
            return
        }

        response.writeHead(404).end('Not found')
    })

    server.on('error', (error) => settle(rejectToken, error))
    await new Promise((resolve, reject) => {
        server.listen(0, 'localhost', resolve)
        server.once('error', reject)
    })

    const address = server.address()
    localOrigin = `http://localhost:${address.port}`
    const timeout = setTimeout(() => {
        settle(rejectToken, new Error('Firebase browser sign-in timed out'))
    }, timeoutMs)

    try {
        console.log('Opening a browser for Firebase Google sign-in...')
        await browserOpen(`${localOrigin}${signInPath}`)
        const idToken = await tokenPromise
        const claims = summarizeFirebaseIdToken(idToken)

        if (claims.audience !== projectId) {
            throw new Error(`Firebase ID token audience ${claims.audience} does not match project ${projectId}`)
        }

        console.log('Firebase Google sign-in complete.')
        return {idToken}
    } finally {
        clearTimeout(timeout)
        await closeServer(server)
    }
}

export function summarizeFirebaseIdToken(idToken) {
    const tokenParts = String(idToken || '').split('.')
    if (tokenParts.length !== 3) {
        throw new Error('FIREBASE_AUTH_ID_TOKEN must be a Firebase JWT')
    }

    try {
        const claims = JSON.parse(Buffer.from(tokenParts[1], 'base64url').toString('utf8'))
        return {
            uid: claims.user_id || claims.sub || null,
            admin: claims.admin === true,
            lpuAdmin: claims.lpuAdmin === true,
            qaUser: claims.qaUser === true,
            audience: claims.aud || null,
            expiresAt: Number.isFinite(claims.exp)
                ? new Date(claims.exp * 1000).toISOString()
                : null,
            decodedWithoutVerification: true
        }
    } catch {
        throw new Error('FIREBASE_AUTH_ID_TOKEN contains an invalid JWT payload')
    }
}

const summarizeProbeResponse = (response) => ({
    status: response.status,
    allowed: response.status >= 200 && response.status < 300,
    documentReturned: Boolean(response.data?.name),
    returnedDocumentCount: Array.isArray(response.data?.documents)
        ? response.data.documents.length
        : 0,
    errorStatus: response.data?.error?.status || null
})

export async function firebaseLockcollectionsAccessProbe({
                                                              documentPath = defaultTestDocumentPath,
                                                              collectionName = 'lockcollections',
                                                              auth,
                                                              httpClient = axios
                                                          } = {}) {
    const firebaseAuth = await getFirebaseAuth(auth)
    const idToken = requireConfigValue(firebaseAuth.idToken, 'FIREBASE_AUTH_ID_TOKEN')
    const claims = summarizeFirebaseIdToken(idToken)
    const targetUserId = documentPath.split('/')[1] || null
    const requestConfig = {
        headers: getAuthorizedHeaders(idToken),
        params: {
            'mask.fieldPaths': '_securityProbeNoData'
        },
        validateStatus: () => true
    }

    const getResponse = await httpClient.get(buildFirestoreUrl(documentPath), requestConfig)
    const listResponse = await httpClient.get(buildFirestoreUrl(collectionName), {
        ...requestConfig,
        params: {
            ...requestConfig.params,
            pageSize: 1
        }
    })

    const expectedByRules = {
        get: claims.uid === targetUserId || claims.admin || claims.lpuAdmin,
        list: claims.admin
    }
    const observed = {
        get: summarizeProbeResponse(getResponse),
        list: summarizeProbeResponse(listResponse)
    }

    return {
        claims,
        target: {documentPath, targetUserId, collectionName},
        expectedByRules,
        observed,
        behaviorMatchesRules: observed.get.allowed === expectedByRules.get &&
            observed.list.allowed === expectedByRules.list
    }
}

export async function firebaseGetTest(
    collection,
    documentId,
    auth
) {
    const firebaseAuth = await getFirebaseAuth(auth)
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
    const firebaseAuth = await getFirebaseAuth(auth)
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
    const firebaseAuth = await getFirebaseAuth(auth)
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
    const result = await firebaseLockcollectionsAccessProbe({
        documentPath: process.env.FIREBASE_TEST_DOCUMENT_PATH || defaultTestDocumentPath
    })
    jsonIt(result)

    if (!result.behaviorMatchesRules) {
        throw new Error('Observed Firestore access does not match the supplied rules')
    }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
    runFirebaseApiAuthTest().catch((error) => {
        console.error(error.response?.data || error.message || error)
        process.exitCode = 1
    })
}
