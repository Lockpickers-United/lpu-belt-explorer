import fs from 'node:fs/promises'
import {authenticate} from '@google-cloud/local-auth'
import {google} from 'googleapis'

export const googleScopes = Object.freeze([
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/forms.responses.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
])

async function loadSavedCredentials({fileSystem, fromJSON, tokenPath}) {
    try {
        const content = await fileSystem.readFile(tokenPath, 'utf8')
        return fromJSON(JSON.parse(content))
    } catch {
        return null
    }
}

async function saveCredentials({client, credentialsPath, fileSystem, tokenPath}) {
    const content = await fileSystem.readFile(credentialsPath, 'utf8')
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token
    })
    await fileSystem.writeFile(tokenPath, payload)
}

export async function authorizeGoogle({
    credentialsPath,
    tokenPath,
    scopes = googleScopes,
    fileSystem = fs,
    authenticateUser = authenticate,
    fromJSON = credentials => google.auth.fromJSON(credentials)
}) {
    let client = await loadSavedCredentials({fileSystem, fromJSON, tokenPath})
    if (client) return client

    client = await authenticateUser({
        scopes,
        keyfilePath: credentialsPath
    })
    if (client.credentials) {
        await saveCredentials({client, credentialsPath, fileSystem, tokenPath})
    }
    return client
}
