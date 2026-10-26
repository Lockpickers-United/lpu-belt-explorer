import crypto from 'node:crypto'
import fs from 'node:fs/promises'

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const SHEETS_API_ROOT = 'https://sheets.googleapis.com/v4/spreadsheets'

export async function createGoogleSheetsClient(credentialsPath, {fetchImpl = globalThis.fetch, now = Date.now} = {}) {
  const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'))
  validateCredentials(credentials)
  let cachedToken = null

  async function getAccessToken() {
    if (cachedToken && cachedToken.expiresAt > now() + 60_000) return cachedToken.value

    const issuedAt = Math.floor(now() / 1000)
    const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
    const unsigned = `${encode({alg: 'RS256', typ: 'JWT'})}.${encode({
      iss: credentials.client_email,
      scope: SHEETS_SCOPE,
      aud: credentials.token_uri,
      iat: issuedAt,
      exp: issuedAt + 3600
    })}`
    const assertion = `${unsigned}.${crypto.sign('RSA-SHA256', Buffer.from(unsigned), credentials.private_key).toString('base64url')}`
    const response = await fetchImpl(credentials.token_uri, {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion
      })
    })
    const data = await readJson(response, 'Google access-token request')
    cachedToken = {
      value: data.access_token,
      expiresAt: now() + (Number(data.expires_in) || 3600) * 1000
    }
    return cachedToken.value
  }

  async function request(url, options = {}, label = 'Google Sheets request') {
    const accessToken = await getAccessToken()
    const response = await fetchImpl(url, {
      ...options,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...(options.body ? {'content-type': 'application/json'} : {}),
        ...options.headers
      }
    })
    return readJson(response, label)
  }

  return {
    async getSheet({spreadsheetId, sheetId, comments=false, notes=false}) {
      const metadataUrl = new URL(`${SHEETS_API_ROOT}/${spreadsheetId}`)
      metadataUrl.searchParams.set('includeGridData', 'false')
      metadataUrl.searchParams.set('fields', 'spreadsheetId,sheets.properties(sheetId,title)')
      const metadata = await request(metadataUrl, {}, 'Google spreadsheet metadata request')
      const sheet = metadata.sheets?.find(candidate => String(candidate.properties?.sheetId) === String(sheetId))
      if (!sheet) throw new Error(`Google sheet id ${sheetId} was not found in spreadsheet ${spreadsheetId}`)

      const title = sheet.properties.title
      const range = quoteSheetTitle(title)
      let details = {}
      if (comments || notes) {
        const detailsUrl = new URL(`${SHEETS_API_ROOT}/${spreadsheetId}`)
        detailsUrl.searchParams.set('ranges', range)
        const detailFields = ['spreadsheetId']
        const sheetDetailFields = ['properties(sheetId,title)']
        if (comments) {
          detailsUrl.searchParams.set('commentsViewMode', 'COMMENTS_VIEW_MODE_INCLUDED')
          detailFields.push('comments')
          sheetDetailFields.push('commentAnchors')
        }
        if (notes) sheetDetailFields.push('data(startRow,startColumn,rowData.values.note)')
        detailFields.push(`sheets(${sheetDetailFields.join(',')})`)
        detailsUrl.searchParams.set('fields', detailFields.join(','))
        details = await request(detailsUrl, {}, `Google sheet details read for ${title}`)
      }

      const valuesUrl = new URL(`${SHEETS_API_ROOT}/${spreadsheetId}/values/${encodeURIComponent(range)}`)
      valuesUrl.searchParams.set('majorDimension', 'ROWS')
      const values = await request(valuesUrl, {}, `Google sheet read for ${title}`)
      const rows = values.values || []
      const detailSheet = details.sheets?.find(candidate => String(candidate.properties?.sheetId) === String(sheetId))
      const commentAnchors = detailSheet?.commentAnchors || []
      const anchorIds = new Set(commentAnchors.map(anchor => anchor.anchorId))
      return {
        spreadsheetId,
        sheetId: String(sheetId),
        title,
        headers: rows[0] || [],
        rows: rows.slice(1).map((cells, index) => ({sheetRow: index + 2, cells})),
        comments: (details.comments || []).filter(comment => anchorIds.has(comment.anchorId)),
        commentAnchors,
        notes: extractCellNotes(detailSheet?.data || [])
      }
    },

    async updateCells({spreadsheetId, updates}) {
      if (updates.length === 0) return {updatedCells: 0, responses: []}
      const response = await request(`${SHEETS_API_ROOT}/${spreadsheetId}/values:batchUpdate`, {
        method: 'POST',
        body: JSON.stringify({
          valueInputOption: 'RAW',
          includeValuesInResponse: true,
          data: updates.map(update => ({range: update.range, values: [[update.value]]}))
        })
      }, 'Google sheet update')
      return {
        updatedCells: response.totalUpdatedCells || 0,
        responses: response.responses || []
      }
    },

    async readRanges({spreadsheetId, ranges}) {
      const url = new URL(`${SHEETS_API_ROOT}/${spreadsheetId}/values:batchGet`)
      for (const range of ranges) url.searchParams.append('ranges', range)
      const response = await request(url, {}, 'Google sheet verification read')
      return response.valueRanges || []
    }
  }
}

export function columnIndexToA1(index) {
  if (!Number.isInteger(index) || index < 0) throw new Error(`Invalid zero-based column index: ${index}`)
  let number = index + 1
  let column = ''
  while (number > 0) {
    const remainder = (number - 1) % 26
    column = String.fromCharCode(65 + remainder) + column
    number = Math.floor((number - 1) / 26)
  }
  return column
}

export function quoteSheetTitle(title) {
  return `'${String(title).replaceAll("'", "''")}'`
}

function extractCellNotes(gridData) {
  return gridData.flatMap(grid => {
    const startRow = grid.startRow || 0
    const startColumn = grid.startColumn || 0
    return (grid.rowData || []).flatMap((row, rowOffset) =>
      (row.values || []).flatMap((cell, columnOffset) => cell.note ? [{
        sheetRow: startRow + rowOffset + 1,
        columnIndex: startColumn + columnOffset,
        column: columnIndexToA1(startColumn + columnOffset),
        note: cell.note
      }] : [])
    )
  })
}

async function readJson(response, label) {
  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`${label} returned invalid JSON (HTTP ${response.status})`)
  }
  if (!response.ok) throw new Error(`${label} failed: HTTP ${response.status}: ${data.error?.message || 'unknown error'}`)
  return data
}

function validateCredentials(credentials) {
  const required = ['client_email', 'private_key', 'token_uri']
  const missing = required.filter(key => typeof credentials[key] !== 'string' || credentials[key] === '')
  if (credentials.type !== 'service_account' || missing.length > 0) {
    throw new Error(`Invalid Google service-account credentials; missing: ${missing.join(', ') || 'type=service_account'}`)
  }
}
