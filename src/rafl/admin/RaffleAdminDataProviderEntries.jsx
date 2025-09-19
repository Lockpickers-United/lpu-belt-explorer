import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../../context/DataContext'
import FilterContext from '../../context/FilterContext'
import removeAccents from 'remove-accents'
import dayjs from 'dayjs'
import {setDeepUnique} from '../../util/setDeep'
import DBContext from '../../app/DBContext.jsx'
import RaffleContext from '../RaffleContext.jsx'
import {raffleStatusSort} from '../../data/filterFields'

export function RaffleAdminDataProviderEntries({children}) {

    const globalContext = useContext(DataContext)

    const {entriesLoaded, allRaffleEntries} = useContext(DBContext)
    const {allPots} = useContext(RaffleContext)

    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, expandAll, ...filters} = allFilters || {}

    // Filters as an array
    const filterArray = useMemo (() => Object.keys(filters)
        .map(key => {
            const value = filters[key]
            return Array.isArray(value)
                ? value.map(subkey => ({key, value: subkey}))
                : {key, value}
        })
        .flat()
    , [filters])

    const mappedEntries = useMemo(() => {
        let charityNames = {}
        let potNames = {}

        allRaffleEntries?.forEach(entry => {
            entry.donations.forEach(donation => {
                setDeepUnique(charityNames, [entry.id], donation.charity.itemFullTitle)
            }, [])
            entry.pots.forEach(pot => {
                setDeepUnique(potNames, [entry.id], pot.itemTitle)
            }, [])
        }, {})

        return allRaffleEntries
            .map(entry => ({
                ...entry,
                charities: charityNames[entry.id] || [],
                potNames: potNames[entry.id] || [],
                fuzzy: removeAccents([
                    entry.username,
                    ...charityNames[entry.id],
                    ...potNames[entry.id]
                ].join(','))
            }))

    }, [allRaffleEntries])

    const flatEntries = useMemo(() => {
        return mappedEntries.reduce((acc, entry) => {
            entry.pots.forEach(pot => {
                acc.push({
                    username: entry.username,
                    entryId: entry.id,
                    platform: entry.platform,
                    potId: pot.itemId,
                    potTickets: pot.tickets
                })
            })
            return acc
        }, [])
    }, [mappedEntries])


    const visibleEntries = useMemo(() => {
        if (!entriesLoaded) return []
        const filtered = mappedEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })
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
                    return raffleStatusSort(a.status, b.status)
                } else if (sort === 'username') {
                    return a.username?.localeCompare(b.username)
                } else if (sort === 'totalDonation') {
                    return b.totalDonation - a.totalDonation
                } else {
                    return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
                }
            })
            : searched.sort((a, b) => {
                return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
            })
    }, [entriesLoaded, filterArray, mappedEntries, search, sort])

    const mappedPotEntries = useMemo(() => {
        return allPots.map((pot) => {
            const entriesForPot = flatEntries.filter(e => e.potId === pot.id)
            if (entriesForPot.length > 0) {
                pot.entrants = entriesForPot
            }
            return pot
        }, [])
    }, [allPots, flatEntries])
    console.log('mappedPotEntries', mappedPotEntries)

    const visiblePotEntries = useMemo(() => {
        //if (!entriesLoaded) return []
        const filtered = mappedPotEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })
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
                    return raffleStatusSort(a.status, b.status)
                } else if (sort === 'username') {
                    return a.username?.localeCompare(b.username)
                } else if (sort === 'totalDonation') {
                    return b.totalDonation - a.totalDonation
                } else {
                    return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
                }
            })
            : searched.sort((a, b) => {
                return a.potNumber - b.potNumber
            })
    }, [filterArray, mappedPotEntries, search, sort])

    const getPotFromId = useCallback(id => {
        return mappedPotEntries.find(e => e.id === id)
    }, [mappedPotEntries])

    const value = useMemo(() => ({
        ...globalContext,
        allEntries: allRaffleEntries,
        visibleEntries,
        mappedPotEntries,
        visiblePotEntries,
        getPotFromId,
        expandAll,
        statusLabels
    }), [globalContext, allRaffleEntries, visibleEntries, mappedPotEntries, visiblePotEntries, getPotFromId, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export const statusLabels = {
    pending: {entryColor: 'Blue', backgroundColor: '#3e71bd', textColor: '#fff'},
    approved: {entryColor: 'Green', backgroundColor: '#34732f', textColor: '#fff'},
    issues: {entryColor: 'Orange', backgroundColor: '#e16936', textColor: '#fff'},
    rejected: {entryColor: 'Red', backgroundColor: '#c52323', textColor: '#fff'}
}

export default RaffleAdminDataProviderEntries
