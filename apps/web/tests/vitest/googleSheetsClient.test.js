import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    readFile: vi.fn(),
    sign: vi.fn()
}))

vi.mock('node:fs/promises', () => ({
    default: {readFile: mocks.readFile}
}))

vi.mock('node:crypto', () => ({
    default: {sign: mocks.sign}
}))

import {createGoogleSheetsClient} from '../../src/data/googleSheetsClient.js'

const jsonResponse = data => ({
    ok: true,
    status: 200,
    text: vi.fn().mockResolvedValue(JSON.stringify(data))
})

describe('Google Sheets client', () => {
    beforeEach(() => {
        mocks.readFile.mockResolvedValue(JSON.stringify({
            type: 'service_account',
            client_email: 'sheets@example.test',
            private_key: 'test-key',
            token_uri: 'https://oauth.example.test/token'
        }))
        mocks.sign.mockReturnValue(Buffer.from('signature'))
    })

    it('requests and returns comment threads and anchors for the selected sheet', async () => {
        const selectedAnchor = {
            anchorId: 'selected-anchor',
            range: {sheetId: 42, startRowIndex: 2, endRowIndex: 3}
        }
        const selectedComment = {
            commentId: 'selected-comment',
            anchorId: 'selected-anchor',
            headPost: {content: 'Needs review'}
        }
        const fetchImpl = vi.fn()
            .mockResolvedValueOnce(jsonResponse({access_token: 'token', expires_in: 3600}))
            .mockResolvedValueOnce(jsonResponse({
                spreadsheetId: 'spreadsheet-1',
                sheets: [
                    {properties: {sheetId: 42, title: 'Classification'}},
                    {properties: {sheetId: 99, title: 'Other'}}
                ]
            }))
            .mockResolvedValueOnce(jsonResponse({
                spreadsheetId: 'spreadsheet-1',
                comments: [
                    selectedComment,
                    {commentId: 'other-comment', anchorId: 'other-anchor'}
                ],
                sheets: [
                    {
                        properties: {sheetId: 42, title: 'Classification'},
                        commentAnchors: [selectedAnchor],
                        data: [{
                            startRow: 1,
                            rowData: [{values: [{}, {note: 'Cell note'}]}]
                        }]
                    },
                    {
                        properties: {sheetId: 99, title: 'Other'},
                        commentAnchors: [{anchorId: 'other-anchor', range: {sheetId: 99}}]
                    }
                ]
            }))
            .mockResolvedValueOnce(jsonResponse({values: [
                ['Name', 'Belt'],
                ['Example lock', 'Blue']
            ]}))
        const client = await createGoogleSheetsClient('/credentials.json', {
            fetchImpl,
            now: () => 1_700_000_000_000
        })

        const sheet = await client.getSheet({
            spreadsheetId: 'spreadsheet-1',
            sheetId: 42,
            comments: true,
            notes: true
        })

        const detailsUrl = new URL(fetchImpl.mock.calls[2][0])
        expect(detailsUrl.searchParams.get('ranges')).toBe("'Classification'")
        expect(detailsUrl.searchParams.get('commentsViewMode')).toBe('COMMENTS_VIEW_MODE_INCLUDED')
        expect(detailsUrl.searchParams.get('fields')).toBe([
            'spreadsheetId',
            'comments',
            'sheets(properties(sheetId,title),commentAnchors,data(startRow,startColumn,rowData.values.note))'
        ].join(','))
        expect(String(fetchImpl.mock.calls[3][0])).toContain("/values/'Classification'?majorDimension=ROWS")
        expect(sheet).toEqual({
            spreadsheetId: 'spreadsheet-1',
            sheetId: '42',
            title: 'Classification',
            headers: ['Name', 'Belt'],
            rows: [{sheetRow: 2, cells: ['Example lock', 'Blue']}],
            comments: [selectedComment],
            commentAnchors: [selectedAnchor],
            notes: [{sheetRow: 2, columnIndex: 1, column: 'B', note: 'Cell note'}]
        })
    })
})
