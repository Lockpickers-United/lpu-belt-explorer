import React, {useContext, useCallback} from 'react'
import DataContext from '../locks/LockDataProvider'
import BeltStripe from '../entries/BeltStripe.jsx'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../entries/entryName'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItem from '@mui/material/ListItem'
import {allUpgradesPartitioned} from '../entries/entryutils'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {useNavigate} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import IntroCopy from '../misc/IntroCopy.jsx'

function Entries() {
    const {allEntries = []} = useContext(DataContext)
    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])
    const navigate = useNavigate()

    const handleClick = useCallback(entry => () => {
        navigate(`/locks?id=${entry.id}`)
    }, [navigate])

    const allUpgradeEntries = allUpgradesPartitioned.map(entryIdArray => {
        return entryIdArray.map(entryId => {
            return getEntryFromId(entryId)
        }).filter(x => x)
    }).filter(x => x.length > 0)
        .sort((a, b) => {
            return entryName(a[0]).localeCompare(entryName(b[0]))
        })

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const linkSx = {color: '#eee', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }}

    return (
        <React.Fragment>
            <div style={{margin: 8, padding: '20px 0px'}}>

                <IntroCopy pageName={'upgrades'}/>

                {allUpgradeEntries.map((upgradeTree, index) =>
                    <React.Fragment key={index}>
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
                                            <OpenInNewIcon fontSize='small'/>
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItem>
                            </React.Fragment>
                        )}
                        <div style={{...style, borderTop: '1px solid #666', height: 20}}/>
                    </React.Fragment>
                )
                }
            </div>
        </React.Fragment>
    )
}

export default Entries
