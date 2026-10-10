import React, {useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import {classificationStatuses, flagStatuses} from './ClassificationConfig.jsx'
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon'
import ClassificationContext from '../app/ClassificationContext.jsx'
import {useMatches} from 'react-router-dom'

export default function ClassificationAdminButton({entry, handleToggle, style, flag = false}) {
    const {accessInfo} = useAccess()
    const isClassification = useMatches().some(match => match.handle?.route === 'classification')
    const {getAdminActionStatus} = useContext(ClassificationContext)

    if (!accessInfo?.features?.classificationVote) return null
    if (!isClassification) return null

    const status = getAdminActionStatus(entry) ?? 'No Votes'
    if (flag && !flagStatuses.includes(status)) return null

    const color = classificationStatuses[status]?.color ?? '#666'
    const Icon = classificationStatuses[status]?.Icon ?? ShieldMoonIcon

    const fontSize = flag ? '1.4rem' : '1.6rem'
    const buttonStyle = flag ? {padding: 2} : {}

    const Legend =
        <div>
            {Object.entries(classificationStatuses).map(([status, {color, Icon}], index) =>
                <div key={index} style={{display: 'flex', alignItems: 'center', gap: 8, margin: 6}}>
                    <Icon style={{color}}/> {status}
                </div>)}
        </div>

    return !flag
        ? (
            <Tooltip title={Legend} arrow disableFocusListener slotProps={{tooltip: {sx: {backgroundColor: '#333'}}}}>
                <IconButton onClick={handleToggle} style={{...buttonStyle, ...style}}>
                    <Icon style={{color, fontSize}}/>
                </IconButton>
            </Tooltip>
        )
        : status !== 'Published' &&
        (
            <Tooltip title={Legend} arrow disableFocusListener slotProps={{tooltip: {sx: {backgroundColor: '#333'}}}}>
                <IconButton style={{...buttonStyle, ...style}}>
                    <Icon style={{color, fontSize}}/>
                </IconButton>
            </Tooltip>
        )
}