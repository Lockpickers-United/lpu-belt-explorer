import React, {useCallback, useContext, useMemo, useState} from 'react'
import FilterContext from '../context/FilterContext'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import belts from '../data/belts'
import LockListContext from '../locks/LockListContext.jsx'

export default function FilterScopeToggle({style = {}}) {

    const {
        filters,
        addFilter,
        removeFilters,
    } = useContext(FilterContext)
    const {tab} = useContext(LockListContext)
    const {belt} = filters

    const isLocks = /\/locks/.test(location.hash)
    const beltScope = useMemo(() => {
        return tab
            ? tab
            : belt
                ? belt
                : 'White'
    }, [belt, tab])
    const scope = useMemo(() => beltScope !== 'search' ? 'belt' : 'all', [beltScope])

    const [initialBelt, setInitialBelt] = useState(beltScope)

    if (beltScope !== initialBelt && beltScope !== 'search') {
        setInitialBelt(beltScope)
    } else if (scope === 'belt' && beltScope === 'search') {
        setInitialBelt('search')
    }

    const changeScope = useCallback(value => () => {
        if (value === 'all') {
            addFilter('tab', 'search', true)
        } else if (value === 'belt') {
            removeFilters(['belt'])
            addFilter('tab', initialBelt, true)
        }
    }, [addFilter, initialBelt, removeFilters])

    const {color, lineColor = '#999'} = belts[initialBelt] ? belts[initialBelt] : {color: '#inherit'}
    const beltOpacity = scope === 'belt' ? 1 : 0.7


    return (
        <React.Fragment>
            {belts[initialBelt] && isLocks &&
                <div style={style}>
                    <ToggleButtonGroup
                        variant='outlined'
                    >
                        <ToggleButton
                            key={'belt'}
                            onClick={changeScope('belt')}
                            style={{
                                color: scope === 'belt' ? '#eee' : '#777',
                                backgroundColor: scope === 'belt' ? 'inherit' : '#111',
                                padding: '4px 12px', borderColor: '#666'
                            }}
                            value={'belt'}
                            disabled={scope === 'belt'}
                        >
                            <div style={{
                                backgroundColor: color,
                                height: 12,
                                width: 12,
                                borderColor: lineColor,
                                borderRadius: 6,
                                border: '1px solid',
                                marginRight: 8,
                                opacity: beltOpacity
                            }}/>
                            {initialBelt} BELT
                        </ToggleButton>
                        <ToggleButton
                            key={'all'}
                            onClick={changeScope('all')}
                            style={{
                                color: scope === 'all' ? '#eee' : '#777',
                                backgroundColor: scope === 'all' ? 'inherit' : '#111',
                                padding: '4px 12px', borderColor: '#666'
                            }}
                            value={'all'}
                            disabled={scope === 'all'}
                        >ALL LOCKS</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            }

        </React.Fragment>
    )
}