import React from 'react'
import Belt from './Belt.jsx'
import queryString from 'query-string'

import data from './data'

function Belts() {
    const [expanded, setExpanded] = React.useState(null)

    const query = queryString.parse(location.search)
    const filters = Object.keys(query)
        .map(key => {
            const value = query[key]
            return Array.isArray(value)
                ? value.map(subkey => ({key, value: subkey}))
                : {key, value}
        })
        .flat()

    const visibleBelts = data
        .filter(belt => {
            return filters.every(({key, value}) => {
                return Array.isArray(belt[key])
                    ? belt[key].includes(value)
                    : belt[key] === value
            })
        })

    return (
        <div style={{margin: 8, maxWidth: 700}}>
            {visibleBelts.map((datum, index) =>
                <Belt
                    key={index}
                    index={index}
                    belt={datum}
                    expanded={expanded}
                    onAccordionChange={setExpanded}
                />
            )}
        </div>
    )
}

export default Belts
