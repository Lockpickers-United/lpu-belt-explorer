import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

function CopyEntryButton({entry}) {
    const handleClick = useCallback(async () => {
        const text = entry.makeModels
            .map(({make, model}) => {
                return make && make !== model ? `${make} ${model}` : model
            }).join('\n')
        await navigator.clipboard.writeText(text)
    }, [entry.makeModels])

    return (
        <IconButton onClick={handleClick}>
            <ContentCopyIcon/>
        </IconButton>
    )
}

export default CopyEntryButton
