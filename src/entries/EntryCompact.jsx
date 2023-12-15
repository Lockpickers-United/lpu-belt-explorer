import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import BeltStripe from './BeltStripe'
import EntryName from '../entries/EntryName.js'
import FieldValue from './FieldValue'
import Stack from '@mui/material/Stack'
import Tracker from '../app/Tracker'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import CollectionFormHoriz from './CollectionFormHoriz.jsx'
import CollectionButton from "./CollectionButton.jsx";
import {styled} from '@mui/material/styles'
import OpenLinkToEntryButton from './OpenLinkToEntryButton.jsx'

console.log('EntryCompact start')

function Entry({entry, expanded, onExpand}) {
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 0}
    const ref = useRef(null)

    const handleChange = useCallback((_, isExpanded) => {
        onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])


    const {collection} = queryString.parse(location.search)

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(true)
        }
    }, [expanded, entry, scrolled])

    const CustomizedAccordion = styled(Accordion)(
        '::before { background-color:#000; opacity: 1; }'
    )

    return (
        <CustomizedAccordion expanded={expanded} onChange={handleChange} style={style} ref={ref}
                             disableGutters={true}
                             sx={{"& .Mui-expanded": {backgroundColor: '#000'}}}
        >
            <AccordionSummary
                expandIcon={<CollectionButton id={entry.id} useIcon={true}/>}
                //sx={{"& .Mui-expanded": {backgroundColor:'#2a2a2a'}}}
            >
                <BeltStripe value={entry.belt}/>
                <div style={{margin: '6px 0px', width: '95%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue
                        value={EntryName(entry)}
                        textStyle={entry.belt === 'Unranked' ? {color: '#aaa',} : {marginLeft: '0px'}}
                        style={{fontWeight: 500, fontSize: '.95rem', lineHeight: 1.25, marginBottom: 0}}
                    />

                    {
                        !!entry.version &&
                        <FieldValue
                            name=''
                            value={<Typography style={{
                                fontSize: '0.95rem',
                                lineHeight: 1.25,
                                color: '#999',
                            }}>{entry.version}</Typography>}
                            textStyle={entry.belt === 'Unranked' ? {color: '#aaa'} : {}}
                            style={{marginBottom: 0, marginLeft: 0}}
                        />
                    }
                </div>
                <div style={{margin: '0px 0px 0px 0px', width: '5%', flexShrink: 0, flexDirection: 'column'}}>
                    { /*was filter chip*/}
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px', backgroundColor: '#000'}}>
                        <BeltStripe value={entry.belt}/>
                        <div style={{marginTop:0, marginLeft: 12}}>
                            <CollectionFormHoriz id={entry.id} entry={entry}/>
                        </div>
                            {
                                collection &&
                                <div style={{width:28, marginTop:4, marginLeft:'auto', marginRight:0}}>
                                    <OpenLinkToEntryButton entry={entry} key={entry.id} id={entry.id}/>
                                </div>
                            }
                                </AccordionDetails>
                    <AccordionActions disableSpacing sx={{backgroundColor: '#000'}}>
                        <Tracker id={entry.id}/>
                    </AccordionActions>
                </React.Fragment>
            }
        </CustomizedAccordion>
    )
}
console.log('EntryCompact end')

export default React.memo(Entry)
