import {describe, expect, it, vi} from 'vitest'
import {createClassificationGcloudDb} from './classificationGcloudDb.js'

const basePath = 'projects/lpu-belt-explorer/databases/lpubelts-dev/documents'

function response(body, status = 200) {
    return {ok: status >= 200 && status < 300, status, json: async () => body}
}

describe('Classification Google Cloud CLI Firestore transport', () => {
    it('reads every page and decodes document fields without exposing the access token', async () => {
        const fetchImpl = vi.fn()
            .mockResolvedValueOnce(response({
                documents: [{
                    name: `${basePath}/classificationVotes/v_first`,
                    fields: {
                        createdAt: {timestampValue: '2026-10-14T00:00:00Z'},
                        revision: {integerValue: '1'},
                        chips: {arrayValue: {values: [{mapValue: {fields: {
                            belt: {stringValue: 'Blue'}, valid: {booleanValue: true}
                        }}}]}}
                    }
                }],
                nextPageToken: 'second'
            }))
            .mockResolvedValueOnce(response({
                documents: [{name: `${basePath}/classificationVotes/v_second`, fields: {}}
                ]
            }))
        const db = createClassificationGcloudDb({fetchImpl, accessTokenProvider: () => 'private-token'})
        const snapshot = await db.collection('classificationVotes').get()
        expect(snapshot.docs.map(doc => doc.id)).toEqual(['v_first', 'v_second'])
        expect(snapshot.docs[0].data()).toEqual({
            createdAt: new Date('2026-10-14T00:00:00Z'), revision: 1,
            chips: [{belt: 'Blue', valid: true}]
        })
        expect(new URL(fetchImpl.mock.calls[1][0]).searchParams.get('pageToken')).toBe('second')
        expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe('Bearer private-token')
        expect(() => db.collection('unrelated')).toThrow('Unexpected Classification collection')
    })

    it('commits create-only writes with the expected target and timestamp encoding', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response({writeResults: [{}]}))
        const db = createClassificationGcloudDb({fetchImpl, accessTokenProvider: () => 'private-token'})
        const batch = db.batch()
        batch.create(db.collection('classificationVotes').doc('v_one'), {
            entryId: 'entry-one', createdAt: new Date('2026-10-14T00:00:00.000Z'),
            revision: 1, comment: null, metadata: {active: false}, omitted: undefined
        })
        await batch.commit()
        const [url, options] = fetchImpl.mock.calls[0]
        expect(url).toBe(`https://firestore.googleapis.com/v1/${basePath}:commit`)
        expect(options.method).toBe('POST')
        expect(JSON.parse(options.body)).toEqual({writes: [{
            update: {name: `${basePath}/classificationVotes/v_one`, fields: {
                entryId: {stringValue: 'entry-one'},
                createdAt: {timestampValue: '2026-10-14T00:00:00.000Z'},
                revision: {integerValue: '1'}, comment: {nullValue: null},
                metadata: {mapValue: {fields: {active: {booleanValue: false}}}}
            }},
            currentDocument: {exists: false}
        }]})
    })

    it('targets the default production database only when selected', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response({documents: []}))
        const db = createClassificationGcloudDb({
            fetchImpl, accessTokenProvider: () => 'private-token', databaseId: '(default)'
        })
        await db.collection('classificationVotes').get()
        expect(String(fetchImpl.mock.calls[0][0])).toContain(
            '/databases/(default)/documents/classificationVotes'
        )
        expect(() => createClassificationGcloudDb({databaseId: 'unexpected'}))
            .toThrow('Unsupported Classification migration database')
    })

    it('fails closed on a refused commit or incomplete result', async () => {
        const denied = createClassificationGcloudDb({
            fetchImpl: vi.fn().mockResolvedValue(response({}, 409)),
            accessTokenProvider: () => 'private-token'
        })
        const deniedBatch = denied.batch()
        deniedBatch.create(denied.collection('classificationVotes').doc('v_one'), {revision: 1})
        await expect(deniedBatch.commit()).rejects.toThrow('HTTP 409')

        const incomplete = createClassificationGcloudDb({
            fetchImpl: vi.fn().mockResolvedValue(response({writeResults: []})),
            accessTokenProvider: () => 'private-token'
        })
        const incompleteBatch = incomplete.batch()
        incompleteBatch.create(incomplete.collection('classificationVotes').doc('v_one'), {revision: 1})
        await expect(incompleteBatch.commit()).rejects.toThrow('unexpected write count')
    })
})
