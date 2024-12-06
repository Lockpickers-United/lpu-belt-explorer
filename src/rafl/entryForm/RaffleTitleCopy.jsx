import React from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import LocalSeeOutlinedIcon from '@mui/icons-material/LocalSeeOutlined'
import EditIcon from '@mui/icons-material/Edit'

function RaffleTitle({entry}) {

    const {isMobile, flexStyle} = useWindowSize()

    const diameter = !isMobile ? 30 : 28
    const fontSize = !isMobile ? '1.3rem' : '1.1rem'
    const lineHeight = !isMobile ? '1rem' : '1rem'
    const paddingLeft = !isMobile ? 0 : 0

    const titleSize = !isMobile ? '1.4rem' : '1.3rem'
    const titleLineHeight = !isMobile ? '1.8rem' : '1.6rem'

    return (
        <React.Fragment>
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                {entry.potNumber &&
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
                        marginTop: !isMobile ? -3 : 0
                    }}>
                        {entry.title}
                    </div>

                    {entry.type === 'donation' &&
                        <React.Fragment>
                            <div style={{marginTop: !isMobile ? 1 : 0, marginLeft: 24}}>
                                {entry.date && <span>{entry.date}</span>}
                            </div>
                            <div style={{flexGrow: 1, marginTop: !isMobile ? 3 : 0, marginLeft: 30}}>
                                <LocalSeeOutlinedIcon fontSize={'small'} style={{marginRight: 16}}/>
                                <EditIcon fontSize={'small'}/>
                            </div>
                        </React.Fragment>
                    }

                    <div style={{flexGrow: 1}}/>

                    {entry.winner &&
                        <div style={{
                            display: 'flex',
                            fontSize: titleSize,
                            lineHeight: titleLineHeight,
                            marginTop: !isMobile ? -3 : 8,
                            marginRight: 10,
                            fontWeight: 400
                        }}>Winner: <strong>&nbsp;mgsecure</strong></div>
                    }

                    {entry.entryTickets &&
                        <div style={{
                            display: 'flex',
                            fontSize: titleSize,
                            lineHeight: titleLineHeight,
                            marginTop: !isMobile ? -3 : 8,
                            marginRight: 10,
                            fontWeight: 400
                        }}>Tickets: <strong>&nbsp;{entry.entryTickets}</strong></div>
                    }
                </div>
            </div>
        </React.Fragment>
    )

}

export default RaffleTitle