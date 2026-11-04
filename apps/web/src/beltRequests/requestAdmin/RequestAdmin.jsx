import React, {useCallback, useContext, useState} from 'react'
import DataContext from '../../context/DataContext.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import Nav from '../../nav/Nav.jsx'
import BeltRequestEntry from './BeltRequestEntry.jsx'
import AdvancedFilters from '../../filters/AdvancedFilters.jsx'
import SearchBox from '../../nav/SearchBox.jsx'
import ViewFilterButtons from '../../filters/ViewFilterButtons.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import {beltRequestSortFields} from '../../data/sortFields.js'
import FilterContext from '../../context/FilterContext.jsx'
import LoadingDisplayNav from '../../nav/LoadingDisplayNav.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import ErrorMessage from '../../misc/ErrorMessage.jsx'
import DBContext from '../../app/DBContext.jsx'
import {Link} from 'react-router-dom'
import ExportButtonGeneric from '../../misc/ExportButtonGeneric.jsx'
import {useAccess} from '../../app/AccessContext.jsx'

export default function RequestAdmin() {
    usePageTitle('Belt Request Admin')
    const {accessInfo} = useAccess()

    const {dbLoaded, dbError, viewing, toggleViewAll} = useContext(DBContext)
    const {visibleEntries = []} = useContext(DataContext)
    const {filters, clearFilters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const toggleView = useCallback(() => {
        clearFilters()
        toggleViewAll()
    }, [clearFilters, toggleViewAll])

    const {isMobile} = useWindowSize()

    if (!dbLoaded) return (
        <LoadingDisplayNav>
            <LoadingDisplay message={'Loading belt requests'} style={{marginTop: 40}}/>
        </LoadingDisplayNav>
    )
    if (dbError) return (
        <LoadingDisplayNav>
            <ErrorMessage errorMessage={`Could not belt requests: ${dbError.message}`}/>
        </LoadingDisplayNav>
    )

    const extras = (
        <React.Fragment>
            <SearchBox label='Requests' keepOpen={false}
                       entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={beltRequestSortFields} advancedEnabled={true}
                               extraFilters={[{key: 'tab', value: 'search'}]}
                               resetAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', width: '100%', color: '#ccc'}

    return (
        <React.Fragment>
            <Nav title='Request Admin' extras={extras}/>

            <div style={{...style, textAlign: 'right', padding: 16, fontSize: '0.8rem', fontWeight: 400}}
                 id='toggle-all'>
                <span style={{color: '#999'}}>view:</span>
                &nbsp;{viewing === 'open' ? 'open requests' :
                <Link onClick={toggleView} to={null}>open requests</Link>} |
                &nbsp;{viewing === 'all' ? 'all requests' : <Link onClick={toggleView} to={null}>all requests</Link>}
            </div>

            <AdvancedFilters/>

            <div style={{height: 8}}/>

            {visibleEntries.length === 0
                ? <>
                <div style={{...style, textAlign: 'center', color: '#fff',
                    fontSize: '1.5rem', fontWeight: 700, marginTop: 32, marginBottom: 32}}>
                    All Clear!</div>
                </>
                : <>
                    {visibleEntries.map((entry, index) =>
                        <BeltRequestEntry
                            key={index}
                            entry={entry}
                            expanded={entry.id === entryExpanded
                                || visibleEntries.length === 1}
                            onExpand={setEntryExpanded}
                        />
                    )}
                </>
            }

            {accessInfo.roles.admin &&
                <div style={{...style, textAlign: 'center', marginTop: 24}}>

                <ExportButtonGeneric exportData={{data: visibleEntries}}/>
                </div>
            }

        </React.Fragment>
    )
}