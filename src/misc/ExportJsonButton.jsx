import FileDownloadIcon from '@mui/icons-material/FileDownload'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import DataContext from '../contexts/DataContext'

function ExportJsonButton() {
    const {visibleEntries} = useContext(DataContext)
    const handleClick = useCallback(() => {
        const data = JSON.stringify(visibleEntries)
        const element = document.createElement('a')
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data))
        element.setAttribute('download', 'lpubeltsdata.json')

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    }, [visibleEntries])

    return (
        <Tooltip title='Export JSON' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <FileDownloadIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default ExportJsonButton
