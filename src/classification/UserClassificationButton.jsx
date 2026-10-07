import React, {useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import BeltIcon from '../entries/BeltIcon.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'

export default function UserClassificationButton({entry, handleToggle}) {
    const {accessInfo} = useAccess()
    if (!accessInfo?.features?.classificationVote) return null

    const {getUserVote} = useContext(ClassificationContext)
    const currentUserVote = getUserVote(entry.id)

    currentUserVote && console.log('currentUserVote', currentUserVote)

    return (
        <Tooltip title={'Classification'} arrow disableFocusListener>
            <IconButton onClick={() => handleToggle('classification')}
                        style={{marginRight: '10px', padding: '8px 4px'}}>
                <BeltIcon value={currentUserVote?.belt || 'Unclassified'}
                          text={currentUserVote?.belt ? undefined : '?'}
                          related={true}
                          containerStyle={{height: 24, width: 24}}
                          style={{height: 24, width: 20, marginTop: -3}}
                          rankStyle={{top: 3}}/>
            </IconButton>
        </Tooltip>
    )
}