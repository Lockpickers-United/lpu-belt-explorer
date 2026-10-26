import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'

export default function RaffleSubHead({text}) {

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}


    return (
        <div style={{
            display: 'flex', ...style,
            backgroundColor: '#333',
            minHeight: 72,
            alignItems: 'center',
            borderBottom: '1px #555 solid'
        }}>
            <div style={{fontWeight: 700, fontSize: '1.5rem', marginLeft: 8}}>
                {text}
            </div>
        </div>

    )

}