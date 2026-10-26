import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {createRequire} from 'node:module'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {google} from 'googleapis'
import {authorizeGoogle, googleScopes} from './googleAuthorization.js'

const require = createRequire(import.meta.url)
const localAuthRequire = createRequire(require.resolve('@google-cloud/local-auth/package.json'))
const {UserRefreshClient} = localAuthRequire('google-auth-library')

function requestRecorder(data = {}) {
    const requests = []
    return {
        requests,
        request: vi.fn(async options => {
            requests.push(options)
            return {data}
        })
    }
}

describe('Google API generated-client contracts', () => {
    it('constructs Forms v1 GET and batch-update requests through an injected auth client', async () => {
        const auth = requestRecorder({items: []})
        const forms = google.forms({version: 'v1', auth})
        const requestBody = {
            requests: [{deleteItem: {location: {index: 0}}}]
        }

        await forms.forms.get({formId: 'form-123'})
        await forms.forms.batchUpdate({formId: 'form-123', requestBody})

        expect(auth.requests).toHaveLength(2)
        expect(auth.requests[0]).toMatchObject({
            method: 'GET',
            url: 'https://forms.googleapis.com/v1/forms/form-123'
        })
        expect(auth.requests[1]).toMatchObject({
            method: 'POST',
            url: 'https://forms.googleapis.com/v1/forms/form-123:batchUpdate',
            data: requestBody
        })
    })

    it('constructs the Sheets v4 values request used by the RAFL utility', async () => {
        const auth = requestRecorder({values: []})
        const sheets = google.sheets({version: 'v4', auth})

        await sheets.spreadsheets.values.get({
            spreadsheetId: 'sheet-123',
            range: 'Review!A:ZZ'
        })

        expect(auth.requests).toHaveLength(1)
        expect(auth.requests[0]).toMatchObject({
            method: 'GET',
            url: 'https://sheets.googleapis.com/v4/spreadsheets/sheet-123/values/Review%21A%3AZZ'
        })
    })

    it('accepts the Google Auth client supplied by local-auth 3', async () => {
        const auth = new UserRefreshClient('client-id', 'client-secret', 'refresh-token')
        auth.request = vi.fn(async options => ({data: {items: [], requestUrl: options.url}}))

        const response = await google.forms({version: 'v1', auth}).forms.get({formId: 'form-123'})

        expect(auth.request).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            url: 'https://forms.googleapis.com/v1/forms/form-123'
        }))
        expect(response.data.items).toEqual([])
    })
})

describe('RAFL Google authorization cache', () => {
    let tempDir
    let tokenPath
    let credentialsPath

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lpu-google-auth-'))
        tokenPath = path.join(tempDir, 'token-forms.json')
        credentialsPath = path.join(tempDir, 'credentials.json')
    })

    afterEach(async () => {
        vi.restoreAllMocks()
        await fs.rm(tempDir, {recursive: true, force: true})
    })

    it('uses an external cached token without reading the OAuth client file', async () => {
        const token = {
            type: 'authorized_user',
            client_id: 'cached-client-id',
            client_secret: 'cached-client-secret',
            refresh_token: 'cached-refresh-token'
        }
        await fs.writeFile(tokenPath, JSON.stringify(token))
        const authenticateUser = vi.fn()

        const client = await authorizeGoogle({
            credentialsPath,
            tokenPath,
            authenticateUser
        })

        expect(client.credentials.refresh_token).toBe(token.refresh_token)
        expect(authenticateUser).not.toHaveBeenCalled()
        await expect(fs.access(credentialsPath)).rejects.toThrow()
    })

    it('uses the configured credential path and saves a reusable external token', async () => {
        const credentials = {
            installed: {
                client_id: 'new-client-id',
                client_secret: 'new-client-secret'
            }
        }
        await fs.writeFile(credentialsPath, JSON.stringify(credentials))
        const client = {credentials: {refresh_token: 'new-refresh-token'}}
        const authenticateUser = vi.fn(async () => client)
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        await expect(authorizeGoogle({
            credentialsPath,
            tokenPath,
            authenticateUser
        })).resolves.toBe(client)

        expect(authenticateUser).toHaveBeenCalledWith({
            scopes: googleScopes,
            keyfilePath: credentialsPath
        })
        expect(consoleError).not.toHaveBeenCalled()
        await expect(fs.readFile(tokenPath, 'utf8')).resolves.toBe(JSON.stringify({
            type: 'authorized_user',
            client_id: credentials.installed.client_id,
            client_secret: credentials.installed.client_secret,
            refresh_token: client.credentials.refresh_token
        }))
    })
})
