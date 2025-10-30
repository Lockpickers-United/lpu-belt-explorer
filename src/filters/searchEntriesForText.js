import {isValidRegex} from '../util/stringUtils'
import entryName from '../entries/entryName'
import fuzzysort from 'fuzzysort'
import removeAccents from 'remove-accents'

export default function searchEntriesForText(search, entries, searchCutoff = 0.3) {

    const exactMatch = search && entries.find(e => e.id === search)
    if (exactMatch) {
        return [exactMatch]
    }

    const regex = /^\/(.*)\/$/.exec(search)
    if (regex && isValidRegex(regex[1])) {
        return entries.reduce((acc, entry) => {
            if (entryName(entry, 'long').match(new RegExp(regex[1], 'i'))) acc.push(entry)
            return acc
        }, [])
    }

    return !search
        ? entries
        : fuzzysort.go(removeAccents(search), entries, {keys: ['fuzzy'], threshold: -23000})
            .map(result => ({
                ...result.obj,
                score: result.score
            }))
            .filter(entry => entry.score > searchCutoff)

}