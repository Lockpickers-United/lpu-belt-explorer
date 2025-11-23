import React, {useCallback, useEffect, useRef, useState} from 'react'
import ListItem from '@mui/material/ListItem'
import BeltStripe from '../entries/BeltStripe.jsx'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../entries/entryName'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {useNavigate} from 'react-router-dom'
import queryString from 'query-string'

function UpgradeEntry({upgradeTree = [], baseId, expanded, onExpand}) {
    const navigate = useNavigate()
    const ref = useRef(null)
    const [scrolled, setScrolled] = useState(false)
    const {id} = queryString.parse(location.search)

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? baseId : false)
    }, [baseId, onExpand])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const isIdFiltered = id === baseId

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref?.current?.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, scrolled, baseId, id])

    const handleClick = useCallback(entry => () => {
        navigate(`/locks?id=${entry.id}`)
    }, [navigate])

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const linkSx = {color: '#eee', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }}

    return (
        <div ref={ref} onChange={handleChange}>
            <div style={{...style, borderTop: '1px solid #666', height: 0}}/>
            {upgradeTree.map(entry =>
                <React.Fragment key={entry.id}>
                    <ListItem
                        style={{
                            ...style, minHeight: 64,
                            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRight: '1px solid #666'
                        }}
                    >
                        <BeltStripe value={entry.belt}/>
                        <ListItemText
                            primary={entryName(entry)}
                            primaryTypographyProps={{fontWeight: 500}}
                            secondary={entry.version}
                            style={{padding: '0px 0px 0px 10px'}}
                            sx={linkSx}
                            onClick={handleClick(entry)}
                        />
                        <ListItemIcon style={{minWidth: 20, marginLeft: 16}}>
                            <IconButton onClick={handleClick(entry)}>
                                <OpenInNewIcon fontSize='small' style={{color: '#eee'}}/>
                            </IconButton>
                        </ListItemIcon>
                    </ListItem>
                </React.Fragment>
            )}
            <div style={{...style, borderTop: '1px solid #666', height: 20}}/>
        </div>

    )
}

export default React.memo(UpgradeEntry, (prevProps, nextProps) => {
    return prevProps.baseId === nextProps.baseId &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
