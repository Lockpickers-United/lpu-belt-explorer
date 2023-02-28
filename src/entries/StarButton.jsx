import React, {useCallback, useContext} from 'react'
import StarIcon from '@mui/icons-material/Star.js'
import StarBorderIcon from '@mui/icons-material/StarBorder.js'
import IconButton from '@mui/material/IconButton'
import StorageContext from '../contexts/StorageContext.jsx'
import {Tooltip} from '@mui/material'

function StarButton({id}) {
    const {starredEntries, setStorageValue} = useContext(StorageContext)
    const isStarred = starredEntries.includes(id)

    const handleClick = useCallback(() => {
        const newValue = isStarred
            ? starredEntries.filter(val => val !== id)
            : [...starredEntries, id]

        setTimeout(() => setStorageValue('starredEntries', newValue), 0)
    }, [id, isStarred, setStorageValue, starredEntries])

    return (
        <Tooltip title={isStarred ? 'Unstar' : 'Star'} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                {
                    isStarred
                        ? <StarIcon style={isStarred ? {color: 'gold'} : {}}/>
                        : <StarBorderIcon style={isStarred ? {color: 'gold'} : {}}/>
                }
            </IconButton>
        </Tooltip>
    )
}

export default StarButton
