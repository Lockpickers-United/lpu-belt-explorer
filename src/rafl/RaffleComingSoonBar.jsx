import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'

export default function RaffleComingSoonBar() {

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}


    return (
        <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
            <div style={{padding: '4px 4px 10px 4px'}}>
                <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 7}}>
                    RAFL is coming soon!
                </div>
                We will start accepting entries on January 1st. In the meantime,
                here&#39;s a preview of the pots that folks are developing.
                Please note that <strong>all pots and contents are subject to change</strong> until
                the raffle begins in January.
            </div>
        </div>

    )

}