import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import BeltIcon from '../entries/BeltIcon.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'

export default function UserClassificationButton({entry, handleToggle, isClassification}) {
    const {accessInfo} = useAccess()
    const {getUserVote, getAdminActionStatus} = useContext(ClassificationContext)

    if (!accessInfo?.features?.classificationVote) return null

    const currentUserVote = getUserVote(entry)
    const status = getAdminActionStatus(entry)

    currentUserVote && console.log('currentUserVote', currentUserVote)

    const iconText = status === 'Settled'
        ? 'X'
        : currentUserVote?.votedBelt
            ? ''
            : '?'

    const tooltipText = status === 'Settled'
        ? 'Not open to votes at this time'
        : 'Classification'

    const handleClick = useCallback(() => {
            !isClassification && handleToggle('classification')
        },
        [handleToggle, isClassification])

    return (
        <Tooltip title={tooltipText} arrow disableFocusListener>
            <IconButton onClick={handleClick}
                        style={{marginRight: '10px', padding: '8px 4px'}}>
                <BeltIcon value={currentUserVote?.votedBelt || 'Unclassified'}
                          text={iconText}
                          inactive={status === 'Settled'}
                          related={true}
                          containerStyle={{height: 24, width: 24}}
                          style={{height: 24, width: 20, marginTop: -3}}
                          rankStyle={{top: 3}}/>
            </IconButton>
        </Tooltip>
    )
}