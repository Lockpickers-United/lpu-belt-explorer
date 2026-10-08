import {describe, expect, it} from 'vitest'
import {findLastMentionedVoter} from '../../scripts/classificationNoteMatcher.js'

const doctorHogmaster = {
    userId: 'hnX373zhNoT1QZ3lc8IWVEvcz0R2',
    displayName: 'DoctorHogmaster',
    aliases: ['DocHog', 'Doc Hog']
}

const anotherVoter = {
    userId: 'another-voter',
    displayName: 'Another Voter'
}

describe('findLastMentionedVoter', () => {
    it.each(['DocHog', 'Doc Hog', 'DoctorHogmaster'])('recognizes %s as the voter', name => {
        expect(findLastMentionedVoter(name + ': Purple', [doctorHogmaster])).toBe(doctorHogmaster)
    })

    it('uses the last mention when a note names multiple voters', () => {
        expect(findLastMentionedVoter('DocHog: Blue\nAnother Voter: Purple', [doctorHogmaster, anotherVoter]))
            .toBe(anotherVoter)
        expect(findLastMentionedVoter('Doc Hog: Blue\nAnother Voter: Purple\nDOC HOG: Brown', [doctorHogmaster, anotherVoter]))
            .toBe(doctorHogmaster)
    })

    it('matches punctuation in aliases without treating it as a regex operator', () => {
        const voter = {...doctorHogmaster, aliases: ['Doc.Hog']}
        expect(findLastMentionedVoter('Doc.Hog: Blue', [voter])).toBe(voter)
        expect(findLastMentionedVoter('DocxHog: Blue', [voter])).toBeUndefined()
    })

    it('does not match an alias inside a longer name', () => {
        expect(findLastMentionedVoter('SuperDocHog: Blue', [doctorHogmaster])).toBeUndefined()
    })
})
