import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../../context/DataContext'
import FilterContext from '../../context/FilterContext'
import dayjs from 'dayjs'
import belts, {danBeltSort, danBeltSortReverse} from '../../data/belts'
import collectionOptions from '../../data/collectionTypes'
import removeAccents from 'remove-accents'
import collectionStatsById from '../../data/collectionStatsById.json'
import filterEntries from '../../filters/filterEntries'

/**
 * @prop scorecardPicks
 */

export function DataProvider({children, allEntries, scorecardEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, dataset, ...filters} = allFilters
    const {userBelt} = filters

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const mappedEntries = useMemo(() => {
        return Object.keys(scorecardEntries)
            .map(key => {
                const entry = getEntryFromId(key)
                if (!entry) return null
                return {
                    ...scorecardEntries[key],
                    userBelt: Object.keys(scorecardEntries[key].scorecardPicks),
                    currentPicks: scorecardEntries[key].scorecardPicks[userBelt ? userBelt : 'All Belts'],
                    ...entry,
                    makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
                    fuzzy: removeAccents(
                        entry.makeModels
                            .map(({make, model}) => [make, model])
                            .flat()
                            .filter(a => a)
                            .concat([
                                entry.version,
                                entry.notes,
                                entry.belt
                            ])
                            .join(',')
                    ),
                    content: [
                        entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                        entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                        entry.links?.length > 0 ? 'Has Links' : 'No Links',
                        belts[entry.belt].danPoints > 0 ? 'Worth Dan Points' : undefined,
                        dayjs(entry.lastUpdated).isAfter(dayjs().subtract(1, 'days')) ? 'Updated Recently' : undefined,
                        entry.belt.startsWith('Black') ? 'Is Black' : undefined,
                        entry.belt !== 'Unranked' ? 'Is Ranked' : undefined
                    ].flat().filter(x => x),
                    collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                    collectionSaves: collectionStatsById[entry.id] || 0,
                    simpleBelt: entry.belt.replace(/\s\d/g, '')
                }
            }).filter(x => x)
    }, [getEntryFromId, profile, scorecardEntries, userBelt])

    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntries(filters, mappedEntries)

        // Check for exact search match by id
        const exactMatch = search && filtered.find(e => e.id === search)
        let searched = filtered

        if (exactMatch) {
            searched = [exactMatch]
        } else if (search) {
            // If there is a search term, fuzzy match that
            searched = fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
        }

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'beltAscending') {
                    return danBeltSort(a.belt, b.belt)
                        || b.currentPicks - a.currentPicks
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'beltDescending') {
                    return danBeltSortReverse(a.belt, b.belt)
                        || b.currentPicks - a.currentPicks
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                }
            })
            : searched.sort((a, b) => {
                return b.currentPicks - a.currentPicks
                    || a.fuzzy.localeCompare(b.fuzzy)
            }).map((entry, index) => ({...entry, displayRank: index + 1}))
    }, [filters, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getEntryFromId,
        expandAll,
        profile
    }), [allEntries, getEntryFromId, visibleEntries, expandAll, profile])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default DataContext
