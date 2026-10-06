import React, {useMemo} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import {classificationStatuses} from './ClassificationData.jsx'
import dayjs from 'dayjs'
import classificationAdminActions from '../data/classification-samples-admin.json'
import GppGoodIcon from '@mui/icons-material/GppGood'
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon'

export default function ClassificationAdminButton({entry, handleToggle}) {
    const {accessInfo} = useAccess()

    const classificationAdminAction = useMemo(() => classificationAdminActions && classificationAdminActions
        .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
        .find(a => a.entryId === entry.id) || {}, [entry.id])

    const color = classificationAdminAction.status
        ? classificationStatuses[classificationAdminAction.status]?.color
        : entry.hasVotes
            ? classificationStatuses.Open.color
            : '#666'

    const Icon = classificationAdminAction.status
        ? classificationStatuses[classificationAdminAction.status]?.icon
        : entry.hasVotes
            ? classificationStatuses.Open.icon || ShieldMoonIcon
            : ShieldMoonIcon

    if (!accessInfo.features.classificationAdmin) return null

    return (
        <Tooltip title='Classification Admin' arrow disableFocusListener>
            <IconButton onClick={handleToggle} style={{marginRight: '10px'}}>
                <Icon style={{color, fontSize: '1.6rem'}}/>
            </IconButton>
        </Tooltip>
    )
}