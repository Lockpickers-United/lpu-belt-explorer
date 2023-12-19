import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import BeltStripe from './BeltStripe'
import CollectionButton from './CollectionButton'
import EntryName from './EntryName'

function CompactEntries({entries}) {
    return (
        <Card style={{maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}}>
            <List dense style={{paddingTop: 0}}>
                {entries.map(entry =>
                    <ListItem key={entry.id} sx={{minHeight: 64, borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}>
                        <BeltStripe value={entry.belt}/>

                        <ListItemText
                            primary={EntryName(entry)}
                            primaryTypographyProps={{fontWeight: 500}}
                            secondary={entry.version}
                            style={{padding: '10px 0px'}}
                        />

                        <ListItemIcon style={{minWidth: 20, marginLeft: 16}}>
                            <CollectionButton id={entry.id} dense/>
                        </ListItemIcon>
                    </ListItem>
                )}
            </List>
        </Card>
    )
}

export default CompactEntries
