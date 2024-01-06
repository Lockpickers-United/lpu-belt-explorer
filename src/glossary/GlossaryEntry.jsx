import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import React, {useCallback} from 'react'
import FieldValue from '../entries/FieldValue'
import GlossaryImageGallery from './GlossaryImageGallery'

function GlossaryEntry({entry, expanded, onExpand}) {
    const handleChange = useCallback((_, isExpanded) => {
        onExpand(isExpanded ? entry.term : false)
    }, [entry.term, onExpand])

    const style = {maxWidth: 500, marginLeft: 'auto', marginRight: 'auto'}

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                {entry.term}
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
                        <FieldValue value={entry.definition}/>
                        {
                            !!entry.media?.length &&
                            <FieldValue value={
                                <GlossaryImageGallery entry={entry}/>
                            }/>
                        }
                    </AccordionDetails>
                    <AccordionActions disableSpacing>

                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default GlossaryEntry
