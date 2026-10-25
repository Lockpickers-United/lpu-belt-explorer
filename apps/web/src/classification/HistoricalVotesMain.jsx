import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ClassificationToolbar from './ClassificationToolbar.jsx'
import DataContext from '../context/DataContext.jsx'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {historicalVotesSortFields} from '../data/sortFields.js'
import ClassificationEntries from './ClassificationEntries.jsx'
import BeltToolbar from '../locks/BeltToolbar.jsx'
import {Paper} from '@mui/material'
import FilterContext from '../context/FilterContext.jsx'

export default function HistoricalVotesMain() {
    usePageTitle('Historical Votes')

    const {visibleEntries = []} = useContext(DataContext)
    const {addFilter, removeFilters} = useContext(FilterContext)

    const [currentTab, setCurrentTab] = useState('search')
    const setTab = useCallback((value) => {
        setCurrentTab(value)
        if(value === 'search') {
            removeFilters(['assignedBelt'])
        } else addFilter('assignedBelt', value, true)
    }, [addFilter, removeFilters])

    const {isMobile} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 16, padding: 0}

    const extras = (
        <React.Fragment>
            <SearchBox label='Locks' keepOpen={false}
                       entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={historicalVotesSortFields} visibleEntries={visibleEntries}
                               advancedEnabled={true} extraFilters={[]} entryType='Lock'
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Historical' extras={extras}/>
            <ClassificationToolbar/>

            <Paper style={{...style, display: 'flex', justifyContent: 'center'}}>
                <BeltToolbar tab={currentTab} setTab={setTab} inactiveOpactiy={1}/>
            </Paper>

            <ClassificationEntries advancedEnabled={true}/>

            <Tracker feature='classificationPrevious'/>

        </React.Fragment>
    )
}
