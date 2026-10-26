import fuzzysort from 'fuzzysort'
import removeAccents from 'remove-accents'
import {isValidRegex} from '../util/stringUtils'
import entryName from '../entries/entryName'

export default function SearchEntries(entries, searchTerm, searchCutoff = 0.30) {

    const exactMatch = searchTerm && entries.find(e => e.id === searchTerm)
    if (exactMatch) {
        return [exactMatch]
    }

    const regex = /^\/(.*)\/$/.exec(searchTerm)
    if (regex && isValidRegex(regex[1])) {
        return entries.reduce((acc, entry) => {
            if (entryName(entry, 'long').match(new RegExp(regex[1], 'i'))) acc.push(entry)
            return acc
        }, [])
    }

    return !searchTerm
        ? entries.slice()
        : fuzzysort.go(removeAccents(searchTerm), entries, {keys: ['fuzzy'], threshold: -23000})
            .map(result => ({
                ...result.obj,
                score: result.score
            }))
            .filter(entry => entry.score > searchCutoff)

}