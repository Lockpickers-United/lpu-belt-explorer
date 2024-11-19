import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'

function RaffleTitle({entry}) {

    const {isMobile} = useWindowSize()

    const diameter = !isMobile ? 32 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const paddingLeft = !isMobile ? 1 : 0

    const titleSize = !isMobile ? '1.5rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'

    return (
        <div style={{display:'flex', alignItems:'center'}}>
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
                display: 'flex',
            }}>
                <div style={{margin: 'auto', paddingTop:0, paddingLeft: paddingLeft, fontWeight: 700, fontSize: fontSize}}>
                    {entry.potNumber}
                </div>
            </div>
            <div style={{fontWeight: 500, fontSize: titleSize, lineHeight: titleLineHeight, marginTop: !isMobile ? -3 : 0}}>
                {entry.title}
            </div>
        </div>
    )

}

export default RaffleTitle