import React from 'react'
import HistoricalVotesMain from './HistoricalVotesMain.jsx'
import {HistoricalVoteDataProvider} from './HistoricalVoteDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'

export default function HistoricalVotesRoute() {

    const {allEntries} = useOutletContext()

    return (
        <HistoricalVoteDataProvider allEntries={allEntries}>
            <HistoricalVotesMain/>
        </HistoricalVoteDataProvider>
    )
}
