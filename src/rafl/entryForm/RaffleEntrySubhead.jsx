import React from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'

export default function RaffleEntrySubhead({text}) {

    const {isMobile} = useWindowSize()
    const flexStyle = !isMobile ? 'flex' : 'block'
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}

    //const borderstyle = label === 'Approved Charities' ? {borderBottom: '1px #555 solid'} : {}

    return (
        <div style={{display: flexStyle, ...style, backgroundColor: '#333'}}>
            <div style={{fontWeight: 700, fontSize: '1.4rem'}}>{text}</div>
        </div>

    )

}