import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../locks/LockDataProvider'
import BeltIcon from './BeltIcon'
import {useNavigate} from 'react-router-dom'

function RelatedEntryButton({id, onExpand}) {
    const {getEntryFromId} = useContext(DataContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])
    const navigate = useNavigate()

    const handleClick = useCallback(async () => {
        navigate(`/locks?id=${id}`)
        onExpand(id)
    }, [id, navigate, onExpand])

    return (
        <Tooltip title={entry.version} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BeltIcon value={entry.belt} related={true}/>
            </IconButton>
        </Tooltip>
    )
}

export default RelatedEntryButton
