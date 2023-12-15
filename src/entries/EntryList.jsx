import React, {memo, useContext} from 'react'
import BeltStripe from './BeltStripe'
import CollectionButton from './CollectionButton'
import EntryName from '../entries/EntryName.js'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OpenLinkToEntryButton from './OpenLinkToEntryButton.jsx'
import queryString from 'query-string'
import {styled} from "@mui/material/styles";
import FilterContext from "../contexts/FilterContext.jsx";


function EntryList({entry, index}) {
    const {filters} = useContext(FilterContext)


    let currentCollection = ''
    if (filters && filters.collection) {
        currentCollection = (typeof filters.collection === 'string')
            ? currentCollection = filters.collection
            : currentCollection = filters.collection[0]
    }

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 0}
    const entryText = index + EntryName(entry)

    function rowStyle({index}) {
        if (!(index % 2)) {
            return {backgroundColor: '#111111'}
        }
    }

    return (
        <ListItem style={rowStyle({index})} sx={{minHeight: 64, padding: '0px 12px 0px 24px', marginTop: '1px'}}>
            <BeltStripe value={entry.belt}/>
            <ListItemText
                primary={EntryName(entry)}
                primaryTypographyProps={{fontWeight: 500}}
                secondary={entry.version}
                style={{padding: '10px 0px'}}
            />
            <ListItemIcon style={{minWidth: 20, marginLeft: 16}}>
                {currentCollection && <OpenLinkToEntryButton entry={entry} key={entry.id} id={entry.id}/>}
                <CollectionButton id={entry.id} useIcon={true}/>
            </ListItemIcon>
        </ListItem>

    )
}

export default React.memo(EntryList)
