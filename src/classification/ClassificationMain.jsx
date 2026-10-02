import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import DataContext from '../locks/LockDataProvider.jsx'
import DataTableSort from '../misc/DataTableSort.jsx'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {projectsSortFields} from '../data/sortFields'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import Footer from '../nav/Footer.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import usePageTitle from '../util/usePageTitle.jsx'

export default function ClassificationMain() {
    usePageTitle('Classification')

    const {visibleEntries = []} = useContext(DataContext)

    console.log('visibleEntries', visibleEntries)

    const {isMobile} = useWindowSize()

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

    const linkFunction = useCallback(() => {
    }, [])

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

    const _footerBefore = undefined
    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            [export]
        </div>
    )

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    return (
        <React.Fragment>
            <Nav title='Projects' extras={extras}/>
            <div style={{margin: 8, paddingBottom: 8}}>

                <AdvancedFilters/>
                <div style={style}>
                    <div style={{margin:'24px 8px'}}>
                        intro
                    </div>
                    <DataTableSort
                        tableData={tableData} tableWidth={tableWidth}
                        linkFunction={linkFunction} linkColumnId={'evidenceUrl'}
                        largeFontSize={'0.90rem'}/>
                    <div style={{margin:'24px 8px', textAlign: 'center', fontSize: '0.8rem', color: '#999'}}>
                        Updated: [updateTime]
                    </div>
                </div>
            </div>
            <Footer extras={undefined} before={footerBefore}/>

            <Tracker feature='classification'/>

        </React.Fragment>
    )
}