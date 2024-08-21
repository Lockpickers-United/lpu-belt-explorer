import React, {useCallback, useState} from 'react'
import {danBelts} from '../data/belts'
import CompareBeltBar from './CompareBeltBar.jsx'
import CompareDanStats from './CompareDanStats.jsx'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import CompareSelect from './CompareSelect.jsx'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize.jsx'

function LeaderboardCompare({blackBeltData}) {

    const [open, setOpen] = useState(false)
    const [fighter1, setFighter1] = useState('')
    const [fighter2, setFighter2] = useState('')
    const handleClick = useCallback(() => setOpen(!open), [open])

    const maxValue = danBelts.reduce((acc, belt) => {
        const value1 = fighter1 && fighter1['beltCounts'][belt] ? fighter1['beltCounts'][belt] : 0
        const value2 = fighter2 && fighter2['beltCounts'][belt] ? fighter2['beltCounts'][belt] : 0
        const max = Math.max(value1, value2)
        acc = Math.max(acc, max)
        return acc
    }, 0)

    const bgcolor = open ? '#222' : '#000'
    const bg1 = fighter1?.danPoints > fighter2?.danPoints ? '#333' : '#222'
    const bg2 = fighter2?.danPoints > fighter1?.danPoints ? '#333' : '#222'

    const {isMobile} = useWindowSize()
    const divFlex = !isMobile ? 'flex' : 'block'
    const divBlock = !isMobile ? 'block' : 'flex'
    const cardWidth = !isMobile ? '50%' : '100%'
    const nameMargin = !isMobile ? 10 : 0


    return (
        <React.Fragment>
            <Accordion expanded={open} disableGutters={true} style={{marginBottom: 20, backgroundColor: bgcolor}}>
                <AccordionSummary style={{
                    placeItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                    backgroundColor: bgcolor
                }}>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button onClick={handleClick} variant='outlined' color='info' size='small'>Compare
                            Mode!</Button>
                    </div>
                </AccordionSummary>
                <AccordionDetails style={{backgroundColor: '#111', padding: '8px 0px 0px 0px'}}>

                    <div style={{backgroundColor: '#111', padding: 0}}>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '50%', padding: 0, margin: 4}}>
                                <CompareSelect blackBeltData={blackBeltData} fighter={fighter1} setFighter={setFighter1}
                                               label={'Fighter #1'}/>
                            </div>
                            <div style={{width: '50%', padding: 0, margin: 4}}>
                                <CompareSelect blackBeltData={blackBeltData} fighter={fighter2} setFighter={setFighter2}
                                               label={'Fighter #2'}/>
                            </div>
                        </div>

                        <div style={{display: divFlex}}>
                            <div style={{width: cardWidth, backgroundColor: bg1, padding: 8, margin: 4}}>
                                <div style={{
                                    width: '100%',
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    marginLeft: nameMargin
                                }}>{fighter1?.displayName}</div>
                                <div style={{display: divBlock}}>
                                    <CompareDanStats userData={fighter1}/>
                                    <CompareBeltBar userData={fighter1} max={maxValue}/>
                                </div>
                            </div>

                            <div style={{width: cardWidth, backgroundColor: bg2, padding: 8, margin: 4}}>
                                <div style={{
                                    width: '100%',
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    marginLeft: nameMargin
                                }}>{fighter2?.displayName}</div>
                                <div style={{display: divBlock}}>
                                    <CompareDanStats userData={fighter2}/>
                                    <CompareBeltBar userData={fighter2} max={maxValue}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        </React.Fragment>
    )
}

export default LeaderboardCompare