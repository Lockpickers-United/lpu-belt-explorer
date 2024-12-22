import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'

function RaffleTitle({entry}) {
    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole

    const {isMobile, flexStyle} = useWindowSize()

    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.4rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'

    return (
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
            { showFull &&
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
                    paddingRight:1,
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
                    {entry.title}
                </div>
                {entry.winner &&
                    <div style={{
                        display: 'flex',
                        fontSize: titleSize,
                        lineHeight: titleLineHeight,
                        marginTop: !isMobile ? -3 : 8,
                        marginRight: 10,
                        fontWeight: 400
                    }}>Winner: <strong>&nbsp;{entry.winner}</strong></div>
                }
            </div>
        </div>
    )

}

export default RaffleTitle