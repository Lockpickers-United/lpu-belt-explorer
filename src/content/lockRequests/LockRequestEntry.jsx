import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import FieldValue from '../../entries/FieldValue'
import LockImageGallery from '../../entries/LockImageGallery'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../../entries/entryName'
import useWindowSize from '../../util/useWindowSize.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import DataContext from '../../context/DataContext.jsx'
import queryString from 'query-string'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SubjectIcon from '@mui/icons-material/Subject'

/**
 * @typedef {object} entry
 * @typedef {object} usernames
 * @prop usernames
 * @prop discord
 * @prop userBelt
 */

function LockRequestEntry({entry, expanded, onExpand}) {
    const {expandAll} = useContext(DataContext)
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)

    const {flexStyle} = useWindowSize()

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    useEffect(() => {
        if (expanded && ref && !scrolled && !expandAll) {
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
            setScrolled(false)
        }
    }, [expanded, entry, scrolled, expandAll])

    const discordUsername = entry.usernames.discord ? `@${entry.usernames.discord.replace(/^@/, '')}` : undefined
    const redditUsername = entry.usernames.reddit ? `u/${entry.usernames.reddit.replace(/^\/*u\//, '')}` : undefined

    const userName = discordUsername || redditUsername || undefined
    const userBelt = entry.userBelt ? ` ${entry.userBelt}` : 'Unspecified'

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{display: flexStyle, width: '100%', alignItems: 'center'}}>
                    <ListItemText
                        primary={entryName(entry)}
                        primaryTypographyProps={{fontWeight: 500, fontSize: '1.1rem'}}
                        secondary={entry.version}
                        secondaryTypographyProps={{fontSize: '1rem'}}
                        style={{padding: '0px 0px 0px 10px', cursor: 'pointer'}}
                    />
                    <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}>

                        <FieldValue name='Requested By' value={userName}/>
                        {entry.userBelt &&
                            <FieldValue name='User Belt' value={userBelt} style={{marginLeft: 10}}/>
                        }
                        <div style={{marginLeft: 25, marginRight: 15, width: 40, display: 'flex'}}>
                            <div style={{width: 20}}>
                                {!!entry.media?.length && <CameraAltIcon fontSize='small'/>}
                            </div>
                            <div style={{width: 20}}>
                                {entry.hasDetails && <SubjectIcon fontSize='small'/>}
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            {
                expanded &&
                <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
                    <div style={{display: flexStyle, width: '100%'}}>
                        <div style={{display: 'flex'}}>
                            {
                                !!entry.approximateBelt &&
                                <FieldValue value={
                                    <FieldValue name='Suggested Belt' value={`${entry.approximateBelt} Belt`}/>
                                }/>
                            }
                            {
                                !!entry.lockingMechanisms?.length &&
                                <FieldValue value={
                                    <FieldValue name='Locking Mechanisms' value={entry.lockingMechanisms.join(', ')}/>
                                }/>
                            }
                        </div>
                        {
                            !!entry.features?.length &&
                            <FieldValue value={
                                <FieldValue name='Locking Mechanisms' value={entry.features.join(', ')}/>
                            }/>
                        }
                    </div>
                    {
                        !!entry.notes?.length &&
                        <FieldValue value={
                            <FieldValue name='Notes' value={entry.notes}/>
                        }/>
                    }
                    {
                        !!entry.media?.length &&
                        <FieldValue value={
                            <LockImageGallery entry={entry}/>
                        }/>
                    }
                </AccordionDetails>
            }
        </Accordion>
    )
}

export default React.memo(LockRequestEntry, (prevProps, nextProps) => {
    return prevProps.entry.id === nextProps.entry.id &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
