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

    const {color} = belts[initialBelt] ? belts[initialBelt] : {color: '#inherit'}
    const lineColor = initialBelt === 'Black' ? '#444' : color
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
                                color: scope === 'belt' ? '#fff' : '#777',
                                backgroundColor: scope === 'belt' ? '#3f3f3f' : '#222',
                                height: 28, padding: '0px 10px 0px 0px', borderColor: '#666',
                                width:134, textAlign: 'left', justifyContent: 'flex-start'
                            }}
                            value={'belt'}
                            disabled={scope === 'belt'}
                        >
                            <div style={{
                                backgroundColor: color,
                                height: 26,
                                width: 12,
                                borderRadius: '3px 0px 0px 3px',
                                borderRight: `${lineColor} 1px solid`,
                                marginRight: 8,
                                opacity: beltOpacity
                            }}/>
                            <div style={{flexGrow: 1,  textAlign: 'center'}}>{initialBelt} BELT</div>
                        </ToggleButton>
                        <ToggleButton
                            key={'all'}
                            onClick={changeScope('all')}
                            style={{
                                color: scope === 'all' ? '#fff' : '#777',
                                backgroundColor: scope === 'all' ? '#3f3f3f' : '#222',
                                height: 28, padding: '0px 12px', borderColor: '#666',
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