import React, {useContext, useMemo, useState} from 'react'
import LockRequestEntry from './LockRequestEntry.jsx'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import SearchFilterBar from '../filters/SearchFilterBar.jsx'
import {lockRequestSortFields} from '../data/sortFields'
import Link from '@mui/material/Link'
import SubNav from '../nav/SubNav.jsx'
import ExportRequestsButton from './ExportRequestsButton.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'

export default function ViewLockRequests({requestMod}) {

    const {visibleEntries = [], expandAll} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    //console.log('ViewLockRequests render:', visibleEntries)

    const options = useMemo(() => {
        return [
            {label: 'Request a Lock', page: '/rankingrequests/submit'},
            {label: 'View Requests', page: '/rankingrequests/view'}
        ]
    }, [])

    return (
        <React.Fragment>
            <SubNav options={options} defaultValue={options[1].label}/>

            <div style={{
                maxWidth: 720, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
            }}>

                {requestMod &&
                    <div style={{textAlign: 'right', marginRight: 7, marginBottom: 5}}>
                        <Link onClick={() => console.log('visibleEntries', visibleEntries)}
                              style={{color: '#444', cursor: 'pointer', marginLeft: 10}}>LOG</Link>
                    </div>
                }

                <SearchFilterBar sortValues={lockRequestSortFields} label={'Lock Requests'} resetAll={true}/>
                <AdvancedFilters/>

                {visibleEntries.map((entry) => (
                    <LockRequestEntry
                        key={entry.id}
                        entry={entry}
                        expanded={entry.id === entryExpanded || !!expandAll}
                        onExpand={setEntryExpanded}
                        requestMod={requestMod}
                    />
                ))}

                <div style={{margin: '30px 0px', textAlign: 'center'}}>
                    <ExportRequestsButton text={true} entries={visibleEntries}/>
                </div>

            </div>
        </React.Fragment>
    )

}