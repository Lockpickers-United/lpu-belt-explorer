import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import BeltStripe from '../../entries/BeltStripe'
import entryName from '../../entries/entryName'
import ViewLockButton from '../ViewLockButton.jsx'
import EvidenceButton from '../EvidenceButton.jsx'

function PopularEntry({entry}) {

    const rowColor= entry.link ? '#fff' : '#888'

    return (
        <ListItem
            key={entry.id}
            style={{minHeight: 64, borderTop: '1px solid rgba(255, 255, 255, 0.12)', color:rowColor}}
        >
            <BeltStripe value={entry.belt}/>

            <ListItemText
                primary={entryName(entry)}
                primaryTypographyProps={{fontWeight: 500}}
                secondary={entry.version}
                secondaryTypographyProps={{color:rowColor}}
                style={{padding: '0px 0px 0px 10px'}}
            />

            <ViewLockButton entry={entry} color={rowColor}/>
            <EvidenceButton id={entry.id}/>
        </ListItem>
    )
}

export default React.memo(PopularEntry)
