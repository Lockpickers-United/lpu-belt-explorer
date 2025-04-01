import React, {useCallback, useContext, useMemo, useState} from 'react'
import LockRequestEntry from './LockRequestEntry.jsx'
import DataContext from '../../locks/LockDataProvider.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import SearchFilterBar from '../../filters/SearchFilterBar.jsx'
import {lockRequestSortFields} from '../../data/sortFields'
import ChoiceButtonGroup from '../../util/ChoiceButtonGroup.jsx'
import RequestLock from './RequestLock.jsx'


export default function LockRequests({profile}) {

    const {visibleEntries = [], expandAll} = useContext(DataContext)
    const {filters, setFilters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const options = useMemo(() => {
        return [
            {label: 'Request a Lock', page: '/content/lockrequest'},
            {label: 'View Requests', page: '/content/viewrequests'}
        ]
    }, [])

    const [selected, setSelected] = useState(options[0])
    const handleChange = useCallback(newValue => {
        setSelected(newValue)
        setFilters({})
    }, [setFilters])

    return (
        <React.Fragment>
            <div style={{marginBottom: 20, marginTop: 1}}>
                <ChoiceButtonGroup options={options} onChange={handleChange}/>
            </div>

            {selected['label'] === 'Request a Lock' &&
                <RequestLock profile={profile}/>
            }
            {
                selected['label'] === 'View Requests' &&
                <React.Fragment>

                    <div style={{
                        maxWidth: 720, padding: 0,
                        marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
                    }}>

                        <SearchFilterBar sortValues={lockRequestSortFields} label={'Lock Requests'} resetAll={true}/>

                        {visibleEntries.map((entry, index) => (
                            <LockRequestEntry
                                key={index}
                                entry={entry}
                                expanded={entry.id === entryExpanded || !!expandAll}
                                onExpand={setEntryExpanded}
                            />

                        ))}

                    </div>
                </React.Fragment>
            }
        </React.Fragment>
    )

}