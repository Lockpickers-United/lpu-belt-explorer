import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import BeltStripe from '../entries/BeltStripe'
import CollectionButton from '../entries/CollectionButton'
import entryName from '../entries/entryName'
import Divider from '@mui/material/Divider'
import Tracker from '../app/Tracker.jsx'

function CompactEntries({entries}) {
    return (
        <Card style={{maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}}>
            <List dense style={{padding: 0}}>
                {entries.map(entry =>
                    <ListItem
                        key={entry.id}
                        style={{minHeight: 64, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}
                    >
                        <BeltStripe value={entry.belt}/>

                        <ListItemText
                            primary={entryName(entry)}
                            primaryTypographyProps={{fontWeight: 500}}
                            secondary={entry.version}
                            style={{padding: '0px 0px 0px 10px'}}
                        />

                        <ListItemIcon style={{minWidth: 20, marginLeft: 16}}>
                            <CollectionButton id={entry.id} dense/>
                        </ListItemIcon>
                    </ListItem>
                )}
            </List>
            <Divider/>
            <Tracker feature='compact'/>
        </Card>
    )
}

export default CompactEntries
