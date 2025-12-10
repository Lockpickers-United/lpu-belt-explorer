import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../../context/DataContext'
import FilterContext from '../../context/FilterContext'
import removeAccents from 'remove-accents'
import dayjs from 'dayjs'
import RaffleContext from '../RaffleContext.jsx'
import {raffleStatusSort} from '../../data/filterFields'
import DBContext from '../../app/DBContext.jsx'
import searchEntriesForText from '../../filters/searchEntriesForText'
import filterEntriesAdvanced from '../../filters/filterEntriesAdvanced.js'

export function RaffleAdminDataProviderPots({children, drawing}) {

    const globalContext = useContext(DataContext)

    const {allPots} = useContext(RaffleContext)
    const {allRaffleEntries} = useContext(DBContext)

    console.log('RaffleAdminDataProviderPots', allPots)

    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, expandAll, ...filters} = allFilters || {}

    const flatEntries = useMemo(() => {
        return allRaffleEntries
            .filter(entry => entry.status === 'approved')
            .reduce((acc, entry) => {
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
    }, [allRaffleEntries])

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

    const searchCutoff = 0.3

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, [...mappedPotEntries], searchCutoff)
    },[mappedPotEntries, search])

    const visibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedPotEntries
        })
        const searched = searchEntriesForText(search, [...filtered], searchCutoff)

        let sorted = sort
            ? searched.sort((a, b) => {
                if (sort === 'updatedAt') {
                    return dayjs(a.updatedAt).isBefore(dayjs(b.updatedAt)) ? 1 : -1
                } else if (sort === 'status') {
                    return raffleStatusSort(a.status, b.status)
                } else if (sort === 'username') {
                    return a.username.localeCompare(b.username)
                } else if (sort === 'totalDonation') {
                    return b.totalDonation - a.totalDonation
                } else {
                    return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
                }
            })
            : searched.sort((a, b) => {
                return a.potNumber - b.potNumber
            })
        if (drawing) sorted = sorted.filter(pot => pot.entrants?.length > 0)
        return sorted
    }, [drawing, mappedPotEntries, search, sort])

    const getPotFromId = useCallback(id => {
        return mappedPotEntries.find(e => e.id === id)
    }, [mappedPotEntries])

    const value = useMemo(() => ({
        ...globalContext,
        allEntries: allPots,
        visibleEntries,
        mappedPotEntries,
        getPotFromId,
        expandAll,
        statusLabels
    }), [globalContext, allPots, visibleEntries, mappedPotEntries, getPotFromId, expandAll])

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

export default RaffleAdminDataProviderPots
