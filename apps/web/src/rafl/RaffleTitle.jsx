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
        setFilters({winnerEntryIds: entry.entryId})
    }, [setFilters])


    const buttonDivWidth = isMobile ? '100%' : 'auto'

    const marginBottom = drawing ? 15 : 0
    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.3rem' : '1.15rem'
    const titleLineHeight = !isMobile ? '1.7rem' : '1.5rem'
    const winnerSize = !isMobile ? '1.2rem' : '1.1rem'
    const winnerLineHeight = !isMobile ? '1.3rem' : '1.2rem'

    const winnerList = Array.isArray(entry.winners)
        ? <React.Fragment>
            {entry.winners.map((winner, index) => {
                return <div key={index} style={{display: 'flex', justifyContent: 'right', marginBottom: 4}}>
                    {index === 0 && <span style={{fontWeight: 400, color: '#fff'}}>{winnersPlural}:&nbsp;</span>}
                    <Link style={{
                        color: excessWinners.includes(winner.entryId) ? '#f35454' : '#fff',
                        textAlign: 'right'
                    }}
                          onClick={(e) => openWinnerPots(e, winner)}>{winner.username}</Link>
                    <RaffleDrawButton entry={entry} drawing={drawing}
                                      redrawId={winner.entryId} excessWinner={excessWinners.includes(winner.entryId)}/>
                </div>
            })
            }
        </React.Fragment>
        : undefined

    return (
        <div style={{width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', width: '100%', marginBottom: marginBottom}}>
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
                <div style={{display: flexStyle, flexDirection: 'row', flexGrow: 1, alignItems: 'center'}}>
                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        fontWeight: 500,
                        fontSize: titleSize,
                        lineHeight: titleLineHeight,
                        marginTop: !isMobile ? -3 : 0
                    }}>
                        {entryName}
                        <div style={{
                            whiteSpace: 'nowrap', fontSize: titleSize,
                            lineHeight: titleLineHeight
                        }}>&nbsp;{winnersText}</div>
                    </div>

                    {drawing &&
                        <div style={{display: 'flex', justifyContent: 'right', width: buttonDivWidth}}>
                            <RaffleDrawButton entry={entry} drawing={drawing}/>
                        </div>
                    }
                </div>
                {entry.winners?.length > 0 &&  !isMobile &&
                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        fontSize: winnerSize,
                        lineHeight: winnerLineHeight,
                        marginTop: !isMobile ? 0 : 8,
                        marginBottom: 8,
                        marginRight: 12,
                        fontWeight: 600,
                        justifyItems: 'right'
                    }}>
                        <div style={{width: '100%'}}>
                            {winnerList}
                        </div>
                    </div>
                }
            </div>
            {entry.winners?.length > 0 && isMobile &&
                <div style={{
                    display: 'flex',
                    flexGrow: 1,
                    fontSize: winnerSize,
                    lineHeight: winnerLineHeight,
                    marginTop: !isMobile ? 0 : 8,
                    marginBottom: 8,
                    marginRight: 12,
                    fontWeight: 600,
                    justifyItems: 'right'
                }}>
                    <div style={{width: '100%'}}>
                        {winnerList}
                    </div>
                </div>
            }

        </div>
    )
}

export default RaffleTitle