import React, {useCallback, useContext, useState} from 'react'
import Collapse from '@mui/material/Collapse'
import EntryVideos from './EntryVideos.jsx'
import IconButton from '@mui/material/IconButton'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'
import AccessContext from '../app/AccessContext.jsx'

export default function EntryActionBar({entry}) {
    const {accessInfo = {}} = useContext(AccessContext)

    const [showVideos, setShowVideos] = useState(false)
    const handleShowVideos = useCallback(() => {
        setShowVideos((current) => !current)
    }, [])

    return (
        <div style={{
            margin: '6px 0px 20px 6px',
            backgroundColor: '#2c2c2c',
            padding: '4px',
            border: '1px solid #666',
            borderRadius: '6px'
        }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                {accessInfo.icon}
                {accessInfo.level >= 80 &&
                    <IconButton onClick={handleShowVideos} style={{marginLeft: '10px'}}>
                        <SmartDisplayIcon style={{color: showVideos ? '#fff' : '#ccc'}}/>
                    </IconButton>
                }
            </div>
            <Collapse in={showVideos}>
                {showVideos &&
                    <div style={{margin: '6px 0px 20px 0px'}}>
                        <EntryVideos entry={entry}/>
                    </div>
                }
            </Collapse>
        </div>

    )
}