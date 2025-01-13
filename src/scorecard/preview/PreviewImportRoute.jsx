import React, {useMemo, useState} from 'react'
import dayjs from 'dayjs'
import useData from '../../util/useData.jsx'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import PreviewScorecard from './PreviewScorecard.jsx'
import {ScorecardDataProvider} from '../ScorecardDataProvider.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import calculateScoreForUser from '../../scorecard/scoring'
import {ScorecardListProvider} from '../ScorecardListContext.jsx'
import {scorecardFilterFields} from '../../data/filterFields'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import SearchBox from '../../nav/SearchBox.jsx'
import SortButton from '../../filters/SortButton.jsx'
import {scorecardSortFields} from '../../data/sortFields'
import FilterButton from '../../filters/FilterButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import {unclaimedEvidence, collectionsStatsCurrent} from '../../data/dataUrls'

import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import {useLocation} from 'react-router-dom'
import queryString from 'query-string'
import blackBelts from './blackBelts.json'

function PreviewImportRoute() {

    // https://lpubelts.com/#/profile/scorecard/preview?tab=ff1da1a0

    const {isMobile} = useWindowSize()
    const location = useLocation()

    const collectionsStats = useData({url: collectionsStatsCurrent})
    const popularLocks = collectionsStats.data ? collectionsStats.data.blackBeltOnly.listStats.recordedLocks.topItems : []

    const tabId = useMemo(() => {
        const query = queryString.parse(location.search)
        return query.tab ? query.tab : ''
    }, [location.search])
    const tabName = blackBelts[tabId]

    const [tab, setTab] = useState(tabId)

    const {data, loading, error} = useData({urls})
    const dataReady = (!!data && !loading && !error)

    const allEvidence = data?.unclaimedEvidence

    const evidence = useMemo(() => {
        let evidenceArray = []
        if (allEvidence) {
            evidenceArray = Object.keys(allEvidence).reduce((acc, key) => {
                let entry = allEvidence[key]
                if (entry.tabName === tabName) {
                    acc.push(
                        {
                            'date': entry.evidenceCreatedAt,
                            'evidenceNotes': entry.evidenceNotes,
                            'link': entry.evidenceUrl,
                            'evidenceModifier': entry.evidenceModifier,
                            'matchId': entry.projectId,
                            'userId': entry.tabName
                        }
                    )
                }
                return acc
            }, [])
        }
        return evidenceArray
    }, [allEvidence, tabName])

    const {
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks
    } = calculateScoreForUser(evidence)

    const nav = (
        <React.Fragment>
            <SearchBox label='Scorecard' extraFilters={[{key: 'tab', value: 'search'}]}/>
            <SortButton sortValues={scorecardSortFields}/>
            <FilterButton extraFilters={[{key: 'tab', value: 'search'}]}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footer = ('')

    const title = 'Preview'
    document.title = 'LPU Belt Explorer - Preview Dan Import'

    return (
        <FilterProvider filterFields={scorecardFilterFields}>
            <ScorecardDataProvider cardActivity={scoredActivity} cardBBCount={bbCount} cardDanPoints={danPoints}
                                   cardEligibleDan={eligibleDan} cardNextDanPoints={nextDanPoints}
                                   cardNextDanLocks={nextDanLocks} popularLocks={popularLocks}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        <Nav title={title} extras={nav}/>

                        {!dataReady && <LoadingDisplay/>}
                        {dataReady && <PreviewScorecard tab={tab} setTab={setTab}/>}

                        <Footer extras={footer}/>

                    </LocalizationProvider>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}


const urls = {unclaimedEvidence}


export default PreviewImportRoute