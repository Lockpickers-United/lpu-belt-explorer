import React, {useContext} from 'react'
import {describe, expect, it} from 'vitest'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import votes from '../../src/data/classification-samples.json'
import adminActions from '../../src/data/classification-samples-admin.json'
import changelogs from '../../src/data/classification-samples-changelog.json'

describe('ClassificationProvider source data', () => {
    it('exposes only the application vote, action, and changelog sources', () => {
        let classification
        function CaptureContext() {
            classification = useContext(ClassificationContext)
            return null
        }

        renderWithProviders(<ClassificationProvider><CaptureContext/></ClassificationProvider>)

        expect(classification.allVotes).toBe(votes)
        expect(classification.allAdminActions).toBe(adminActions)
        expect(classification.previousChangelogs).toEqual(changelogs)
    })
})
