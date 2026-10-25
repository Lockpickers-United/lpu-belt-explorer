import React from 'react'

export default function RaffleHeader({width = 700}) {
    const style = {
        maxWidth: width,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'row'
    }

    return (
        <React.Fragment>
            <div style={style}>
                <div style={{flexGrow: 1, fontSize: '1.7rem', margin: 0}}>LPU Raffle</div>
                <div style={{fontSize: '1.4rem', marginTop: '0.3rem'}}>
                    PRIZE DRAWING
                </div>
            </div>
        </React.Fragment>
    )

}


