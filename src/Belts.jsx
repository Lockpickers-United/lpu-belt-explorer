import React, {useMemo} from 'react'
import Belt from './Belt.jsx'
import queryString from 'query-string'

import data from './data'

function Belts() {
    const [expanded, setExpanded] = React.useState(-1)

    const query = queryString.parse(location.search)
    const filters = useMemo(() => {
        return Object.keys(query)
            .map(key => {
                const value = query[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()
    }, [query])

    const visibleBelts = useMemo(() => {
        return data
            .filter(belt => {
                return filters.every(({key, value}) => {
                    return Array.isArray(belt[key])
                        ? belt[key].includes(value)
                        : belt[key] === value
                })
            })
    }, [filters])

    return (
        <div style={{paddingTop: 64, margin: 8, maxWidth: 700}}>
            {visibleBelts.map((datum, index) =>
                <Belt
                    key={index}
                    index={index}
                    belt={datum}
                    expanded={expanded === index}
                    onAccordionChange={setExpanded}
                />
            )}
        </div>
    )
}

export default Belts
