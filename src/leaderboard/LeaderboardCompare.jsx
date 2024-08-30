import React, {useCallback, useMemo, useState} from 'react'
import {danBelts} from '../data/belts'
import CompareBeltBar from './CompareBeltBar.jsx'
import CompareDanStats from './CompareDanStats.jsx'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import CompareSelect from './CompareSelect.jsx'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize.jsx'
import {useLocation, useSearchParams} from 'react-router-dom'
import queryString from 'query-string'

function LeaderboardCompare({blackBeltData, compare}) {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const {tab, bb1, bb2, title} = useMemo(() => {
        const query = queryString.parse(location.search)
        return {
            tab: query.tab ? query.tab : undefined,
            bb1: query.bb1 ? query.bb1 : undefined,
            bb2: query.bb2 ? query.bb2 : undefined,
            title: query.title ? query.title : undefined
        }
    }, [location.search])

    const fighter1 = blackBeltData.find(bb => bb.id === bb1) || ''
    const fighter2 = blackBeltData.find(bb => bb.id === bb2) || ''

    const [open, setOpen] = useState(!!bb1 || !!bb2 || compare)
    const handleClick = useCallback(() => setOpen(!open), [open])
    const handleReset = useCallback(() => {
        searchParams.delete('bb1')
        searchParams.delete('bb2')
        searchParams.delete('title')
        setSearchParams(searchParams)
        setOpen(!open)
    }, [searchParams, setSearchParams, open])

    const name1 = fighter1?.displayName ? fighter1.displayName.replace(/[\s/]/g, '_').replace(/\W/g, '') : 'Unknown'
    const name2 = fighter2?.displayName ? fighter2.displayName.replace(/[\s/]/g, '_').replace(/\W/g, '') : 'Unknown'
    const safeNames = (!!bb1 || !!bb2) ? name1 + '-vs-' + name2 : null

    if ((!!bb1 || !!bb2) && (title !== safeNames)) {
        setTimeout(() => setSearchParams({'tab': tab, 'bb1': bb1, 'bb2': bb2, 'title': safeNames}), 250)
    }

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
                        {!open &&
                            <Button onClick={handleClick} variant='outlined' color='info' size='small'>
                                Compare Mode!
                            </Button>
                        }
                        {open &&
                            <React.Fragment>
                                <Button onClick={handleReset} variant='outlined' color='info' size='small'
                                        style={{marginLeft: 10}}>
                                    Close Compare
                                </Button>
                            </React.Fragment>
                        }
                    </div>
                </AccordionSummary>
                <AccordionDetails style={{backgroundColor: '#111', padding: '16px 0px 0px 0px'}}>
                    <div style={{backgroundColor: '#111', padding: 0}}>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '50%', padding: 0, margin: 4}}>
                                <CompareSelect blackBeltData={blackBeltData} fighter={fighter1}
                                               label={'Fighter #1'} param={'bb1'} opponent={bb2}/>
                            </div>
                            <div style={{width: '50%', padding: 0, margin: 4}}>
                                <CompareSelect blackBeltData={blackBeltData} fighter={fighter2}
                                               label={'Fighter #2'} param={'bb2'} opponent={bb1}/>
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