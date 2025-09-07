import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../../context/DataContext'
import FilterContext from '../../context/FilterContext'
import removeAccents from 'remove-accents'
import dayjs from 'dayjs'
import {setDeepUnique} from '../../util/setDeep'
import DBContext from '../../app/DBContext.jsx'

export function RaffleAdminDataProvider({children}) {
    const {allEntries, entriesLoaded} = useContext(DBContext)

    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, expandAll, ...filters} = allFilters

    const visibleEntries = useMemo(() => {

        let charityNames = {}
        let potNames = {}

        allEntries.forEach(entry => {
            entry.donations.forEach(donation => {
                setDeepUnique(charityNames, [entry.id], donation.charity.itemFullTitle)
            },[])
            entry.pots.forEach(pot => {
                setDeepUnique(potNames, [entry.id], pot.itemTitle)
            },[])
        },{})


        const mappedEntries = allEntries
            .map(entry => ({
                ...entry,
                charities: charityNames[entry.id] || [],
                potNames: potNames[entry.id] || [],
                fuzzy: removeAccents([
                    entry.username,
                    ...charityNames[entry.id],
                    ...potNames[entry.id],
                ].join(',')),
            }))

        console.log('mappedEntries', mappedEntries)

        // Filters as an array
        const filterArray = Object.keys(filters)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()


        // Filter the data
        const filtered = mappedEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
            : filtered

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'updatedAt') {
                    return dayjs(a.updatedAt).isBefore(dayjs(b.updatedAt)) ? 1 : -1
                } else if (sort === 'status') {
                    return statusSort(a.status, b.status)
                } else if (sort === 'username') {
                    return a.username.localeCompare(b.username)
                } else if (sort === 'totalDonation') {
                    return b.totalDonation - a.totalDonation
                } else {
                    return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
                }
            })
            : searched.sort((a, b) => {
                return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
            })
    }, [allEntries, filters, search, sort])

    const getPotFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getPotFromId,
        expandAll,
        statusLabels
    }), [allEntries, visibleEntries, getPotFromId, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']
const statusColors = {
    pending: 'Blue',
    approved: 'Green',
    issues: 'Orange',
    rejected: 'Red'
}
const statusList = [
    'pending',
    'approved',
    'issues',
    'rejected'
]
export const statusSort = (a, b) => {
    return statusList.indexOf(a) - statusList.indexOf(b)
}
export const statusLabels = {
    pending: {entryColor: 'Blue', backgroundColor: '#3e71bd', textColor: '#fff'},
    approved: {entryColor: 'Green', backgroundColor: '#34732f', textColor: '#fff'},
    issues: {entryColor: 'Orange', backgroundColor: '#e16936', textColor: '#fff'},
    rejected: {entryColor: 'Red', backgroundColor: '#c52323', textColor: '#fff'},
}

export const statusSimpleColors = {
    pending: 'Blue',
    approved: 'Green',
    issues: 'Orange',
    rejected: 'Red'
}

export default RaffleAdminDataProvider
