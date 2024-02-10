import React, {useCallback, useDeferredValue, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import dials from '../data/dials.json'
import DialEntry from './DialEntry'

function DialsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [expanded, setExpanded] = useState(searchParams.get('id'))

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        const entry = dials.find(dial => dial.id === id)
        if (entry) {
            const name = (entry.make && entry.model) ? `${entry.make} ${entry.model}` : entry.model
            searchParams.set('id', id)
            searchParams.set('name', name)
            setSearchParams(searchParams)
        }
        setExpanded(id)
    }, [searchParams, setSearchParams])

    return (
        <div style={{margin: 8, paddingBottom: 32}}>
            {dials.map(entry =>
                <DialEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded}
                />
            )}
        </div>
    )
}

export default DialsPage
