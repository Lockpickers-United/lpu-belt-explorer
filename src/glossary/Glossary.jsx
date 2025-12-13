import queryString from 'query-string'
import React, {useMemo} from 'react'
import {useLocation} from 'react-router-dom'
import glossary from '../data/glossary.json'
import GlossaryEntry from './GlossaryEntry'
import GlossaryIntro from './GlossaryIntro'

function Glossary() {
    const location = useLocation()
    const highlightedTerm = useMemo(() => {
        const {term} = queryString.parse(location.search)
        return term && term.toLowerCase()
    }, [location.search])

    return (
        <div style={{
            margin: 8,
            paddingBottom: 32,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginBottom: 16
        }}>
            <GlossaryIntro/>

            {transformedData.map((entry, index) =>
                <GlossaryEntry
                    key={index}
                    entry={entry}
                    highlighted={highlightedTerm === entry.termLowerCased}
                />
            )}
        </div>
    )
}

const transformedData = glossary.map(entry => {
    return {
        ...entry,
        termLowerCased: entry.term.toLowerCase()
    }
})

export default Glossary
