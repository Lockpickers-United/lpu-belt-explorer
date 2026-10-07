import React, {useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import {classificationStatuses} from './ClassificationConfig.jsx'
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon'
import ClassificationContext from '../app/ClassificationContext.jsx'

export default function ClassificationAdminButton({entry, handleToggle}) {
    const {accessInfo} = useAccess()
    if (!accessInfo?.features?.classificationAdmin) return null

    const {getAdminAction} = useContext(ClassificationContext)

    const classificationAdminAction = getAdminAction(entry)

    const status = classificationAdminAction?.status ?? 'No Votes'
    const color = classificationStatuses[status]?.color ??'#666'
    const Icon = classificationStatuses[status]?.Icon ?? ShieldMoonIcon

    const TestPanel =
        <div>
            {Object.entries(classificationStatuses).map(([status, {color, Icon}], index) =>
                <div key={index} style={{display: 'flex', alignItems: 'center', gap: 8, margin: 6}}>
                    <Icon style={{color}}/> {status}
                </div>)}
        </div>

    return (
        <Tooltip title={TestPanel} arrow disableFocusListener slotProps={{
            tooltip: {
                sx: {
                    backgroundColor: '#333',
                },
            },
        }}
        >
            <IconButton onClick={handleToggle} style={{marginRight: '10px'}}>
                <Icon style={{color, fontSize: '1.6rem'}}/>
            </IconButton>
        </Tooltip>
    )
}