import React from 'react'
import HistoricalVotesMain from './HistoricalVotesMain.jsx'
import {HistoricalVoteDataProvider} from './HistoricalVoteDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'
import {historicalFilterFields} from '../data/filterFields.js'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function HistoricalVotesRoute() {

    const {allEntries} = useOutletContext()

    return (
        <FilterProvider filterFields={historicalFilterFields}>
            <HistoricalVoteDataProvider allEntries={allEntries}>
                <HistoricalVotesMain/>
            </HistoricalVoteDataProvider>
        </FilterProvider>
    )
}
