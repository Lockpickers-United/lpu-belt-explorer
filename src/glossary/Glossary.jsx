import React, {useCallback, useState} from 'react'
import glossary from '../data/glossary.json'
import GlossaryEntry from './GlossaryEntry'

function Glossary() {
    const [expanded, setExpanded] = useState()

    const handleExpand = useCallback(value => setExpanded(value), [])

    return (
        <div style={{margin: 8, paddingBottom: 32}}>
            {glossary.map(entry => {
                const isExpanded = expanded === entry.term

                return (
                    <GlossaryEntry
                        key={entry.term}
                        entry={entry}
                        expanded={isExpanded}
                        onExpand={handleExpand}
                    />
                )
            })}
        </div>
    )
}

export default Glossary
