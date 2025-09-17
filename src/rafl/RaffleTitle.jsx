import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'
import Link from '@mui/material/Link'
import RaffleDrawButton from './admin/RaffleDrawButton.jsx'
import FilterContext from '../context/FilterContext.jsx'

function RaffleTitle({entry, drawing = false}) {
    if (!entry) return null

    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole
    const {addFilter} = useContext(FilterContext)


    const {isMobile, flexStyle} = useWindowSize()

    let entryName = entry.displayName ? entry.displayName : entry.title
    const winnersText = (entry.winnerCount > 1 && entry.winners?.length === 0) ? ` (${entry.winnerCount} winners)` : ''

    const openWinnerPots = useCallback((event, entryId) => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault()
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation()

        console.log('openWinnerPots entryId:', entryId)
        addFilter('winnerEntryIds', entryId, true)
    },[addFilter])

    const winnerList = Array.isArray(entry.winners)
        ? <React.Fragment>
            {entry.winners.map((winner, index) => {
                return <span key={winner.id}>
                    <Link style={{color: '#fff'}} onClick={(e) => openWinnerPots(e, winner.entryId)}>{winner.username}</Link>
                    {index < entry.winners.length - 1 ? ', ' : ''}
                    </span>
            })
            }
        </React.Fragment>
        : undefined


    const winnerSuffix = entry.winners?.length > 1 ? 's' : ''
    const winnerAlign = isMobile ? 'left' : 'right'

    const marginBottom = drawing ? 15 : 0
    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.4rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'
    const winnerSize = !isMobile ? '1.3rem' : '1.2rem'

    return (
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
            <div style={{display: flexStyle, flexGrow: 1, placeItems: 'center'}}>
                <div style={{
                    display: 'flex',
                    fontWeight: 500,
                    fontSize: titleSize,
                    lineHeight: titleLineHeight,
                    marginTop: !isMobile ? -3 : 0,
                    flexGrow: 1
                }}>
                    {entryName} &nbsp;
                    <nobr>{winnersText}</nobr>
                </div>

                <div style={{
                    display: 'flex',
                    fontSize: winnerSize,
                    lineHeight: titleLineHeight,
                    marginTop: !isMobile ? -3 : 8,
                    marginRight: 10,
                    fontWeight: 600,
                    textAlign: winnerAlign
                }}>
                    {entry.winners?.length > 0 &&
                        <span><span style={{fontWeight: 400}}>Winner{winnerSuffix}</span>: {winnerList}</span>
                    }
                </div>

                {drawing &&
                    <RaffleDrawButton entry={entry}/>
                }
            </div>
        </div>
    )

}

export default RaffleTitle