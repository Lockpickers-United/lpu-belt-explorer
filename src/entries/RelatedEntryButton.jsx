import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../locks/LockDataProvider'
import BeltIcon from './BeltIcon'
import {useNavigate} from 'react-router-dom'

function RelatedEntryButton({id, onExpand, entryId}) {
    const {getEntryFromId} = useContext(DataContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])
    const navigate = useNavigate()

    const handleClick = useCallback(async () => {
        navigate(`/locks?id=${id}`)
        onExpand(id)
    }, [id, navigate, onExpand])

    const style = id === entryId ? {border:'1px solid #777'} : {}
    const disabled = id === entryId

    return (
        <Tooltip title={entry.version} arrow disableFocusListener>
            <IconButton onClick={handleClick} style={style} disabled={disabled}>
                <BeltIcon value={entry.belt} related={true} disabled={disabled}/>
            </IconButton>
        </Tooltip>
    )
}

export default RelatedEntryButton
