import React, {useCallback, useContext, useMemo, useState} from 'react'
import LockRequestEntry from './LockRequestEntry.jsx'
import DataContext from '../../locks/LockDataProvider.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import SearchFilterBar from '../../filters/SearchFilterBar.jsx'
import {lockRequestSortFields} from '../../data/sortFields'
import ChoiceButtonGroup from '../../util/ChoiceButtonGroup.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'


export default function ViewLockRequests({refresh}) {

    const {visibleEntries = [], expandAll} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const options = useMemo(() => {
        return [
            {label: 'Request a Lock', page: '/content/lockrequest'},
            {label: 'View Requests', page: '/content/lockrequest/view'}
        ]
    }, [])
    const navigate = useNavigate()
    const [selected, setSelected] = useState(options[1]) //eslint-disable-line
    const handleChange = useCallback(newValue => {
        setSelected(newValue)
        navigate(newValue.page)
    }, [navigate])

    return (
        <React.Fragment>
            <div style={{marginBottom: 20, marginTop: 1}}>
                <ChoiceButtonGroup options={options} onChange={handleChange} defaultValue={options[1].label}/>
            </div>

            <div style={{
                maxWidth: 720, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
            }}>

                <Link onClick={() => console.log('visibleEntries', visibleEntries)}
                      style={{color: '#444', cursor: 'pointer'}}>LOG</Link>
                &nbsp; &nbsp; <Link onClick={() => refresh()} style={{color: '#444', cursor: 'pointer'}}>RELOAD</Link>

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
    )

}