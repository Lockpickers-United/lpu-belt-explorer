import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import DataContext from '../locks/LockDataProvider.jsx'
import DataTableSort from '../misc/DataTableSort.jsx'
import ExportButton from '../locks/ExportButton.jsx'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {projectsSortFields} from '../data/sortFields'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import Footer from '../nav/Footer.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import ProjectEvidenceButton from './ProjectEvidenceButton.jsx'
import dayjs from 'dayjs'
import isValidUrl from '../util/isValidUrl'

function ProjectsQuests() {
    const {visibleEntries = [], updateTime} = useContext(DataContext)

    //console.log('visibleEntries', visibleEntries)

    const {isMobile} = useWindowSize()

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const rows = [...visibleEntries]
    const columns = [
        {id: 'pickerName', align: 'left', name: 'Picker Name'},
        {id: 'discipline', align: 'left', name: 'Discipline'},
        {id: 'tier', align: 'center', name: 'Tier'},
        {id: 'date', align: 'center', name: 'Date'},
        {id: 'source', align: 'left', name: 'Source'},
        {id: 'evidenceUrl', align: 'center', name: 'Evidence'},
    ]
    const defaultSort = 'pickerName'
    const tableWidth = '100%'
    const tableData = {columns, rows, defaultSort, sortable: true, wrap: false}

    const linkFunction = useCallback((columnId, string, linkUrl) => {
        if (columnId === 'evidenceUrl') {
            return <ProjectEvidenceButton evidenceUrl={string}/>
        } else if (columnId === 'date') {
            return dayjs(string).format('MM/DD/YY')
        } else if (columnId === 'discipline') {
           return isValidUrl(linkUrl)
               ? <Link onClick={() => openInNewTab(linkUrl)}
                  style={{color: '#fff', fontWeight: 500}}>{string}</Link>
               : string
        } else return string
    }, [openInNewTab])

    const extras = (
        <React.Fragment>
            <SearchBox label='Projects' extraFilters={[{key: 'tab', value: 'search'}]} keepOpen={false}
                       entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={projectsSortFields} advancedEnabled={true}
                               extraFilters={[]} entryType='Project'
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footerBefore = undefined
    const _footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries} advancedEnabled={true}/>
        </div>
    )

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    return (
        <React.Fragment>
            <Nav title='Projects' extras={extras}/>
            <div style={{margin: 8, paddingBottom: 22}}>

                <AdvancedFilters/>
                <div style={style}>
                    <div style={{margin:'24px 8px'}}>
                        The page contains most of our approved projects:
                        those in Scorecards and those entered in the Dan Sheet prior to Sept, 2024.
                        Intended for internal use, many of the links to original requests lead to
                        pages accessible by Black Belts only.
                        (This page not yet optimized for mobile devices.)
                    </div>
                    <DataTableSort
                        tableData={tableData} tableWidth={tableWidth}
                        linkFunction={linkFunction} linkColumnId={'evidenceUrl'}
                        largeFontSize={'0.90rem'}/>
                    <div style={{margin:'24px 8px', textAlign: 'center', fontSize: '0.8rem', color: '#999'}}>
                        Updated: {updateTime}
                    </div>
                </div>
            </div>
            <Footer extras={undefined} before={footerBefore}/>

            <Tracker feature='projectsQuests'/>

        </React.Fragment>
    )
}

export default ProjectsQuests
