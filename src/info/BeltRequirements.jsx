import React, {useCallback, useContext} from 'react'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import ReactMarkdown from 'react-markdown'
import BeltStripe from '../entries/BeltStripe'
import Typography from '@mui/material/Typography'
import AccordionActions from '@mui/material/AccordionActions'
import LockListContext from '../locks/LockListContext'
import InfoButton from './InfoButton'
import LinkToRequirementsButton from './CopyLinkToRequirementsButton'
import beltRequirements from '../data/beltRequirements'
import {uniqueBelts} from '../data/belts'

function BeltRequirements({belt}) {
    const {expanded, setExpanded} = useContext(LockListContext)
    const handleExpand = useCallback((_, isExpanded) => {
        setExpanded(isExpanded ? 'beltreqs' : false)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [setExpanded])
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}
    const markdown = beltRequirements[belt]

    const pinks = ['Baby Pink', 'Hot Pink', 'Fuchsia', 'Blush Pink', 'Rose Pink', 'Coral Pink', 'Pastel Pink', 'Bubblegum Pink', 'Peachy Pink', 'Magenta']
    const pinkBelt = pinks[uniqueBelts.indexOf(belt)]

    if (!markdown) return null
    return (
        <Accordion expanded={expanded === 'beltreqs'} onChange={handleExpand} style={style}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={belt}/>
                <Typography variant='h6' style={{margin: '0px 0px 0px 12px'}}>{pinkBelt} Belt Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails style={{margin: '0px 0px 0px 12px'}}>
                <ReactMarkdown>
                    {markdown}
                </ReactMarkdown>
            </AccordionDetails>
            <AccordionActions>
                <LinkToRequirementsButton/>
                <InfoButton/>
            </AccordionActions>
        </Accordion>
    )
}

export default BeltRequirements
