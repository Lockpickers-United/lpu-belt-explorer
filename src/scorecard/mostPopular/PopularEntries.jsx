import React, {useState, useMemo, useContext, useCallback} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize.jsx'
import PopularEntry from './PopularEntry.jsx'
import List from '@mui/material/List'
import Fade from '@mui/material/Fade'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import FilterContext from '../../context/FilterContext.jsx'

function PopularEntries({owner, popularEntries}) {
    const {isMobile} = useWindowSize()
    const {filters} = useContext(FilterContext)

    const [topN, setTopN] = useState(25)
    const [filter, setFilter] = useState('all')
    const [transition, setTransition] = useState(true)

    const topEntries = useMemo(() => popularEntries.slice(0, topN),[popularEntries, topN])

    const filteredEntries = useMemo(() => {
        return filter === 'picked'
            ? topEntries.filter(e => e.link)
            : filter === 'notPicked'
                ? topEntries.filter(e => !e.link)
                : topEntries
    }, [filter, topEntries])

    const pickedEntries = topEntries.filter(e => e.link).length
    const pickedPercent = filteredEntries.length > 0 ? Math.floor(pickedEntries / topEntries.length * 100) : 0
    const description = owner
        ? 'You\'ve picked'
        : 'Picked'
    const setText = Object.keys(filters).filter(f => f !=='locks' && f !== 'tab').length > 0 ? 'matching' : 'most popular'

    const handleToggle = useCallback(value => () => {
        setTransition(false)
        setTimeout(() => setTopN(value),150)
        setTimeout(() => setTransition(true), 300)
    }, [])

    const flexStyle = isMobile ? 'block' : 'flex'

    const button25 = topN === 25 ? 'contained' : 'text'
    const button50 = topN === 50 ? 'contained' : 'text'
    const button100 = topN === 100 ? 'contained' : 'text'

    const buttonAll = filter === 'all' ? 'contained' : 'text'
    const buttonPicked = filter === 'picked' ? 'contained' : 'text'
    const buttonNotPicked = filter === 'notPicked' ? 'contained' : 'text'

    if (!popularEntries) return <LoadingDisplay/>
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '0px 20px 24px 20px'
            }}>

                <Fade in={transition}>
                    <div style={{fontSize: '1.2rem', fontWeight: 700}}>{description} {pickedEntries} of
                        the {topEntries.length} {setText} locks
                        in BB Scorecards ({pickedPercent}%)
                    </div>
                </Fade>
                (only entries with documentation are counted)

                <div style={{marginTop: 20, display: flexStyle, padding: '0px 20px'}}>

                    <div style={{flexGrow: 1, textAlign: 'left', fontSize: '1rem', marginTop: 6}}>
                        <Button onClick={() => setFilter('all')}
                                color='info'
                                variant={buttonAll}
                                value='all'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem', marginRight:6}}>
                            All
                        </Button>
                        <Button onClick={() => setFilter('picked')}
                                color='info'
                                variant={buttonPicked}
                                value='picked'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem', marginRight:2}}>
                            Picked
                        </Button>
                        <Button onClick={() => setFilter('notPicked')}
                                color='info'
                                variant={buttonNotPicked}
                                value='notPicked'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem'}}>
                            Not Picked
                        </Button>
                    </div>

                    <div style={{flexGrow: 1, textAlign: 'right', fontSize: '1rem', marginTop: 6}}>
                        Top Locks:&nbsp;&nbsp;
                        <Button onClick={handleToggle(25)}
                                color='info'
                                variant={button25}
                                value='25'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            25
                        </Button>
                        <Button onClick={handleToggle(50)}
                                variant={button50}
                                color='info'
                                value='50'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            50
                        </Button>
                        <Button onClick={handleToggle(100)}
                                color='info'
                                variant={button100}
                                value='100'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            100
                        </Button>

                    </div>
                </div>
            </div>

            <div>
                {filteredEntries.map(entry =>
                    <List dense style={{padding: 0}} key={entry.id}>
                        <PopularEntry entry={entry}/>
                    </List>
                )}
            </div>
        </div>
    )
}

export default PopularEntries
