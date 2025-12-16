import React, {useCallback, useContext, useMemo, useState} from 'react'
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

function ProjectsQuests() {
    const {visibleEntries = [], expandAll, updateTime} = useContext(DataContext)

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
        {id: 'tier', align: 'left', name: 'Tier'},
        {id: 'dateText', align: 'left', name: 'Date'},
        {id: 'source', align: 'left', name: 'Source'},
        {id: 'evidenceUrl', align: 'center', name: 'Evidence'},
    ]
    const defaultSort = 'pickerName'
    const tableWidth = '100%'
    const tableData = {columns, rows, defaultSort, sortable: true, wrap: false}

    const linkFunction = useCallback((id, string) => {
        if (id === 'evidenceUrl') return <ProjectEvidenceButton evidenceUrl={string}/>
        return string
        const url = charity.url || `https://www.google.com/search?q=${encodeURIComponent(charity.name)}`
        return id === 'displayName'
            ? <Link onClick={() => openInNewTab(url)}
                    style={{color: '#fff', fontWeight: 700}}>{string}</Link>
            : string
    }, [openInNewTab, visibleEntries])

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

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries} advancedEnabled={true}/>
        </div>
    )

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    return (
        <React.Fragment>
            <Nav title='Projects' extras={extras}/>
            <div style={{margin: 8, paddingBottom: 32}}>

                <AdvancedFilters/>
                <div style={style}>
                    <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>
                </div>
            </div>
            <Footer extras={undefined} before={footerBefore}/>

            <Tracker feature='projectsQuests'/>

        </React.Fragment>
    )
}

export default ProjectsQuests
