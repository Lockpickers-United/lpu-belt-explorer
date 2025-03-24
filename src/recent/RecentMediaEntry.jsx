import React, {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import BeltStripe from '../entries/BeltStripe'
import FieldValue from '../entries/FieldValue'
import LockImageGallery from '../entries/LockImageGallery'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../entries/entryName'
import dayjs from 'dayjs'

function RecentMediaEntry({entry}) {

    const navigate = useNavigate()
    const name = entryName(entry)
    const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        navigate(`/locks?id=${entry.id}&name=${safeName}`)
    }, [entry.id, navigate, safeName])

    return (
        <React.Fragment>
            <ListItem
                key={entry.id}
                style={{
                    minHeight: 64,
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'block',
                    margin: '20px 0px'
                }}
            >
                <div style={{display: 'flex', width: '100%'}}>
                    <BeltStripe value={entry.belt}/>
                    <ListItemText
                        primary={entryName(entry)}
                        primaryTypographyProps={{fontWeight: 500, fontSize: '1.1rem'}}
                        secondary={entry.version}
                        secondaryTypographyProps={{fontSize: '1rem'}}
                        style={{padding: '0px 0px 0px 10px', cursor: 'pointer'}}
                        onClick={handleClick}
                    />
                    {entry.dateDeleted &&
                        <div style={{marginRight:20}}>
                            <FieldValue name='Date Deleted' value={dayjs(entry.dateDeleted).format('YYYY-MM-DD')}/>
                        </div>
                    }
                    <div>
                        <FieldValue name='Entry ID' value={entry.id}/>
                    </div>
                </div>
                {
                    !!entry.media?.length &&
                    <FieldValue value={
                        <LockImageGallery entry={entry}/>
                    }/>
                }
            </ListItem>
        </React.Fragment>
    )
}

export default RecentMediaEntry
