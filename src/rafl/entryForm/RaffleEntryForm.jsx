import React, {useContext, useRef, useState} from 'react'
import FilterContext from '../../context/FilterContext.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import {Collapse} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import RaffleTitle from '../RaffleTitle.jsx'
import RaffleEntrySubhead from './RaffleEntrySubhead.jsx'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function RaffleEntryForm() {
    const {filters} = useContext(FilterContext)
    const [expanded] = useState(filters.id)

    const ref = useRef(null)


    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {isMobile} = useWindowSize()
    const listMargin = !isMobile ? 8 : 0
    const descriptionFontSize = isMobile ? '0.95rem' : '1.0rem'


    const donation = {
        type: 'donation',
        title: 'Wikimedia',
        date: '1/12/25',
        entryTickets: 200
    }

    const entry = {
        type: 'pot',
        potNumber: 2,
        title: 'Basically Every Lockwood',
        entryTickets: 200
    }

    return (

        <div style={{margin: listMargin, paddingBottom: 32}}>

            <div style={style}>

                <RaffleEntrySubhead text={'MY DONATIONS'}/>

                <Accordion expanded={expanded} style={style} ref={ref}>
                    <AccordionSummary expandIcon={null}>
                        <div style={{display: 'block', width: '100%'}}>
                            <RaffleTitle entry={donation}/>
                        </div>
                    </AccordionSummary>
                </Accordion>
            </div>

            <Box style={{...style, textAlign: 'center', marginTop: 16}}>
                <Button color='success' size='small' variant='outlined'>ADD DONATION</Button>
            </Box>


            <div style={{height: 50}}/>

            <div style={style}>
                <RaffleEntrySubhead text={'MY POTS'}/>
                <Accordion expanded={expanded} style={style} ref={ref}>
                    <AccordionSummary expandIcon={null}>
                        <div style={{display: 'block', width: '100%'}}>

                            <RaffleTitle entry={entry}/>

                            <Collapse in={true} style={{width: '100%', marginTop: 12}}>
                                <div style={{
                                    marginRight: 10,
                                    fontSize: descriptionFontSize,
                                    justifyItems: 'right',
                                    display: 'flex'
                                }}>
                                    <div style={{flexGrow: 1}}/>
                                    <div>
                                        <nobr>Donors: <strong>32</strong></nobr>
                                    </div>
                                    <div style={{marginLeft: 12}}>
                                        <nobr>Tickets: <strong>1,350</strong></nobr>
                                    </div>
                                    <div style={{marginLeft: 12}}>
                                        <nobr>Current Odds: <strong>14.8%</strong></nobr>
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    </AccordionSummary>
                </Accordion>
            </div>

            <Box style={{...style, textAlign: 'center', marginTop: 16}}>
                <Button color='success' size='small' variant='outlined'>ADD ANOTHER POT</Button>
            </Box>

        </div>

    )
}

export default RaffleEntryForm
