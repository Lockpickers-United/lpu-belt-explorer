import React, {useCallback, useContext, useEffect, useState} from 'react'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import ReactMarkdown from 'react-markdown'
import BeltStripe from '../entries/BeltStripe.jsx'
import Typography from '@mui/material/Typography'
import belts from '../data/belts.js'
import {AccordionActions} from '@mui/material'
import InfoButton from './InfoButton.jsx'
import AppContext from '../contexts/AppContext.jsx'

function BeltRequirements({belt}) {
    const [data, setData] = useState({})
    const {expanded, setExpanded} = useContext(AppContext)
    const handleExpand = useCallback((_, isExpanded) => {
        setExpanded(isExpanded ? 'beltreqs' : false)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [setExpanded])
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const markdown = data[belt]

    useEffect(() => {
        const load = async () => {
            const value = (await import('../data/beltRequirements.js')).default
            setData(value)
        }
        load()
    }, [])

    return (
        <Accordion expanded={expanded === 'beltreqs'} onChange={handleExpand} style={style}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={belt}/>
                <Typography variant='h6'>{belts[belt].label} Belt Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ReactMarkdown>
                    {markdown}
                </ReactMarkdown>
            </AccordionDetails>
            <AccordionActions>
                <InfoButton/>
            </AccordionActions>
        </Accordion>
    )
}

export default React.memo(BeltRequirements)
