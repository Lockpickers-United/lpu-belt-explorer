import React, {useDeferredValue, useState} from 'react'
import dials from '../data/dials.json'
import DialEntry from './DialEntry'

function DialsPage() {
    const [expanded, setExpanded] = useState()

    const defExpanded = useDeferredValue(expanded)

    return (
        <div style={{margin: 8, paddingBottom: 32}}>
            {dials.map(entry =>
                <DialEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={setExpanded}
                    expanded={entry.id === defExpanded}
                />
            )}
        </div>
    )
}

export default DialsPage
