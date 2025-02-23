import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'

function RaffleTitle({entry}) {
    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole
    const {isMobile, flexStyle} = useWindowSize()

    let entryName = entry.displayName ? entry.displayName : entry.title
    const winnersText = (entry.winnerCount && !entry.winner) ? ` (${entry.winnerCount} winners)` : ''
    entryName = entryName + winnersText

    const marginBottom = entry.winner ? 15 : 0

    const winnerList = Array.isArray(entry.winner) ? entry.winner.join(', ') : undefined
    const winnerSuffix = entry.winner.length > 1 ? 's' : ''
    const winnerAlign = isMobile ? 'left' : 'right'

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
            <div style={{display: flexStyle, flexGrow: 1}}>
                <div style={{
                    display: 'flex',
                    fontWeight: 500,
                    fontSize: titleSize,
                    lineHeight: titleLineHeight,
                    marginTop: !isMobile ? -3 : 0,
                    flexGrow: 1
                }}>
                    {entryName}
                </div>
                {entry.winner.length > 0 &&
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
            </div>
        </div>
    )

}

export default RaffleTitle