import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'
import Link from '@mui/material/Link'
import RaffleDrawButton from './admin/RaffleDrawButton.jsx'
import FilterContext from '../context/FilterContext.jsx'

function RaffleTitle({entry, drawing = false}) {
    if (!entry) return null

    const {raflState, raffleAdminRole, excessWinners} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole
    const {setFilters} = useContext(FilterContext)

    const {isMobile, flexStyle} = useWindowSize()

    let entryName = entry.displayName ? entry.displayName : entry.title
    const winnersText = (entry.winnerCount > 1 && entry.winners?.length === 0) ? ` (${entry.winnerCount} winners)` : ''
    const winnersPlural = (entry.winnerCount > 1) ? 'Winners' : 'Winner'

    // Function to open winner pots filter
    const openWinnerPots = useCallback((event, entry) => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault()
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
        console.log('openWinnerPots entryId:', entry)
        const winnerFilter = `${entry?.username} (${entry?.platform})`
        setFilters({winnerFilterNames: winnerFilter})
    }, [setFilters])

    const winnerList = Array.isArray(entry.winners)
        ? <React.Fragment>
            {entry.winners.map((winner, index) => {
                return <div key={index}>
                    <div style={{display: 'flex', justifyContent: 'right'}}>
                        {index === 0 && <span style={{fontWeight: 400}}>{winnersPlural}:&nbsp;</span>}
                        <Link style={{color: excessWinners.includes(winner.entryId) ? '#f35454' : '#fff'}}
                              onClick={(e) => openWinnerPots(e, winner)}>{winner.username}</Link>
                        {excessWinners.includes(winner.entryId) &&
                            <RaffleDrawButton entry={entry} drawing={drawing} redrawId={winner.entryId}/>
                        }
                    </div>
                </div>
            })
            }
        </React.Fragment>
        : undefined

    const buttonDivWidth = isMobile ? '100%' : 'auto'

    const marginBottom = drawing ? 15 : 0
    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.4rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'
    const winnerSize = !isMobile ? '1.2rem' : '1.1rem'

    return (
        <div style={{display: 'flex', placeItems: 'center', width: '100%', marginBottom: marginBottom}}>
            {showFull &&
                <div style={{
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#000',
                    height: diameter,
                    width: diameter,
                    minWidth: diameter,
                    marginTop: 0,
                    marginBottom: 4,
                    marginRight: 12,
                    display: 'flex'
                }}>
                    <div style={{
                        margin: 'auto',
                        paddingTop: 0,
                        paddingLeft: paddingLeft,
                        paddingRight: 1,
                        fontWeight: 700,
                        fontSize: fontSize,
                        lineHeight: lineHeight
                    }}>{entry.potNumber}</div>
                </div>
            }
            <div style={{display: flexStyle, flexDirection:'row', flexGrow: 1, placeItems: 'flex-start'}}>
                <div style={{
                    display: 'flex',
                    fontWeight: 500,
                    fontSize: titleSize,
                    lineHeight: titleLineHeight,
                    marginTop: !isMobile ? -3 : 0,
                    flexGrow: 1
                }}>
                    {entryName}
                    <nobr>&nbsp;&nbsp;{winnersText}</nobr>
                </div>

                <div style={{
                    display: 'flex',
                    flexGrow: 1,
                    fontSize: winnerSize,
                    lineHeight: titleLineHeight,
                    marginTop: !isMobile ? -3 : 8,
                    marginRight: 10,
                    fontWeight: 600,
                    justifyItems: 'right'
                }}>
                    {entry.winners?.length > 0 &&
                        <div style={{width: '100%'}}>
                            {winnerList}
                        </div>
                    }
                </div>

                {drawing &&
                    <div style={{display: 'flex', justifyContent: 'right', width: buttonDivWidth}}>
                    <RaffleDrawButton entry={entry} drawing={drawing}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default RaffleTitle