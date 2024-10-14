import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../entries/entryName'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

function LeaderboardCompareRow({entry, data}) {

    const picked1 = data && data[0].find(e => entry.id === e.matchId)
    const bgcolor1 = picked1
        ? '#1d801d'
        : '#000'

    const picked2 = data && data[1].find(e => entry.id === e.matchId)
    const bgcolor2 = picked2
        ? '#4d4dc1'
        : '#000'

    const rowBgcolor = picked1 && picked2
        ? '#111'
        : picked1
            ? '#032703'
            : picked2
                ? '#0f0f37'
                : '#000'

    const rowColor = !picked1 && !picked2 ? '#777' : '#fff'

    return (
        <div style={{display: 'flex', backgroundColor: rowBgcolor, borderTop: '2px solid #111'}}>
            <div style={{width: 40, display: 'flex', alignItems: 'center'}}>
                {picked1 &&
                    <CheckBoxIcon style={{color: bgcolor1, marginLeft: 10}}/>
                }
            </div>
            <ListItem
                key={entry.id}
                style={{minHeight: 56, color: rowColor, padding:3}}
            >

                <ListItemText
                    primary={entryName(entry)}
                    primaryTypographyProps={{fontWeight: 500, textAlign: 'center', fontSize: '1.03rem'}}
                    secondary={entry.version}
                    secondaryTypographyProps={{color: '#999', textAlign: 'center'}}
                    style={{padding: '0px 0px 0px 10px'}}
                />
            </ListItem>
            <div style={{width: 40, display: 'flex', alignItems: 'center'}}>
                {picked2 &&
                    <CheckBoxIcon style={{color: bgcolor2, marginRight: 10}}/>
                }
            </div>
        </div>
    )
}

export default LeaderboardCompareRow
