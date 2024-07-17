import React, {useState, useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import ScorecardDataContext from './ScorecardDataProvider'

function ScoringExceptions() {
    const {scoredEvidence} = useContext(ScorecardDataContext)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const unmatchedEvid = scoredEvidence.filter(ev => 'nomatch' === ev.exceptionType)
    const badlinkEvid = scoredEvidence.filter(ev => 'badlink' === ev.exceptionType)
    const samelinedEvid = scoredEvidence.filter(ev => 'duplicate' === ev.exceptionType)
    const supersededEvid = scoredEvidence.filter(ev => 'upgraded' === ev.exceptionType)
    const totalNum = unmatchedEvid.length + badlinkEvid.length + samelinedEvid.length + supersededEvid.length

    if (totalNum > 0) {
        return (
            <React.Fragment>
                <IconButton onClick={handleOpen}>
                    <ErrorOutlineIcon/>
                </IconButton>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                > 

                    {unmatchedEvid.length > 0 && 
                    <React.Fragment>
                        <Typography
                            style={{fontWeight: 500, fontSize: '2.07rem', lineHeight: 1.25, margin: '10px'}}>
                            Noted but 0 points
                        </Typography>

                        <Divider/>
                        <Typography
                            style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, margin: '10px'}}>
                            Could not be matched to a lock or project
                        </Typography>

                        <List dense style={{padding: 0}}>
                            {unmatchedEvid.map(ev =>
                                <ListItem
                                    key={ev.id}
                                    style={{minHeight: 20, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}
                                >
                                    {ev.name}
                                </ListItem>
                            )}    
                        </List>
                    </React.Fragment>
                    }

                    {badlinkEvid.length > 0 && 
                    <React.Fragment>
                        <Divider/>
                        <Typography
                            style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, margin: '10px'}}>
                            Invalid URLs
                        </Typography>

                        <List dense style={{padding: 0}}>
                            {badlinkEvid.map(ev =>
                                <ListItem
                                    key={ev.id}
                                    style={{minHeight: 20, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}
                                >
                                    {ev.name}
                                </ListItem>
                            )}    
                        </List>
                    </React.Fragment>
                    }

                    {samelinedEvid.length > 0 && 
                    <React.Fragment>
                        <Divider/>
                        <Typography
                            style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, margin: '10px'}}>
                            Duplicated by another lock
                        </Typography>

                        <List dense style={{padding: 0}}>
                            {samelinedEvid.map(ev =>
                                <ListItem
                                    key={ev.id}
                                    style={{minHeight: 20, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}
                                >
                                    <Stack direction='column'>
                                        <Typography>{ev.name}</Typography>
                                        <Typography>duplicate of {scoredEvidence.find(e => e.id === ev.samelinedId).name}</Typography>
                                    </Stack>
                                </ListItem>
                            )}    
                        </List>
                    </React.Fragment>
                    }

                    {supersededEvid.length > 0 && 
                    <React.Fragment>
                        <Divider/>
                        <Typography
                            style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, margin: '10px'}}>
                            Upgraded by another lock
                        </Typography>

                        <List dense style={{padding: 0}}>
                            {supersededEvid.map(ev =>
                                <ListItem
                                    key={ev.id}
                                    style={{minHeight: 20, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}
                                >
                                    <Stack direction='column'>
                                        <Typography>{ev.name}</Typography>
                                        <Typography>upgraded by {scoredEvidence.find(e => e.id === ev.supersededId).name}</Typography>
                                    </Stack>
                                </ListItem>
                            )}    
                        </List>
                    </React.Fragment>
                    }
                </Popover>
            </React.Fragment>
        )
    }
}

export default ScoringExceptions
