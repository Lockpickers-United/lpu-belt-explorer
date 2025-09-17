import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import RaffleDrawButton from './admin/RaffleDrawButton.jsx'

function RaffleTitle({entry, drawing = false}) {
    if (!entry) return null

    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole
    const {isMobile, flexStyle} = useWindowSize()

    let entryName = entry.displayName ? entry.displayName : entry.title
    const winnersText = (entry.winnerCount > 1 && entry.winners?.length === 0) ? ` (${entry.winnerCount} winners)` : ''

    const marginBottom = entry.winners?.length > 0 ? 15 : 0

    const winnerList = Array.isArray(entry.winners)
        ? entry.winners.reduce((acc, winner) => {
            acc = acc ? acc + ', ' + winner.username : winner.username
            return acc
        }, '')
        : undefined


    const winnerSuffix = entry.winners?.length > 1 ? 's' : ''
    const winnerAlign = isMobile ? 'left' : 'right'

    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.4rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'
    const winnerSize = !isMobile ? '1.3rem' : '1.2rem'

    return (
        <div style={{display: 'block', width: '100%'}}>
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
                    {entry.winners?.length > 0 && !drawing &&
                        <div style={{
                            display: 'flex',
                            fontSize: winnerSize,
                            lineHeight: titleLineHeight,
                            marginTop: !isMobile ? -3 : 8,
                            marginRight: 10,
                            fontWeight: 600,
                            textAlign: winnerAlign
                        }}><span><span style={{fontWeight: 400}}>Winner{winnerSuffix}</span>: {winnerList}</span></div>
                    }
                    {drawing &&
                        <RaffleDrawButton entry={entry}/>
                    }
                </div>
            </div>
            <div style={{textAlign: 'center', width: '100%', margin: '20px 0px', fontSize: '1.2rem', fontWeight: 600}}>
                WINNERS<br/>
                {entry.winners?.length > 0 && entry.winners.map((winner, index) => {
                    const sep = index < entry.winners.length - 1 ? ', ' : ''
                    return <span key={index}>
                        <Link style={{color:'#fff'}}>{winner.username}</Link>{sep}</span>
                })
                }
            </div>
        </div>
    )

}

export default RaffleTitle