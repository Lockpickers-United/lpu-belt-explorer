import React, {useCallback} from 'react'
import Typography from '@mui/material/Typography'

function SelectableText({children, ...props}) {
    const ignoreClick = useCallback(event => {
        event.stopPropagation()
    }, [])

    return (
        <Typography{...props}>
            <span onClick={ignoreClick} style={{cursor: 'text', userSelect: 'text'}}>{children}</span>
        </Typography>
    )
}

export default SelectableText
