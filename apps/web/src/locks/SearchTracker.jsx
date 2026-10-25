import React, {useState} from 'react'
import Tracker from '../app/Tracker.jsx'
import {useSearchParams} from 'react-router-dom'

export default function SearchTracker() {
    const [searchParams] = useSearchParams()
    const [search, _setSearch] = useState(searchParams.get('search') || '')

    console.log(`SearchTracker render: search='${search}'`)

    return (
        <React.Fragment>
            <Tracker feature='search' term={search}/>
        </React.Fragment>
    )
}