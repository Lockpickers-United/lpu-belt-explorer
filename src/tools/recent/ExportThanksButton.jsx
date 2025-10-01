import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback} from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'

function ExportThanksButton({thanksText}) {

    const handleExportClipboard = useCallback(() => {
        navigator.clipboard.writeText(thanksText).then()
        enqueueSnackbar('Thank you text copied to clipboard.')
    }, [thanksText])

    return (
        <React.Fragment>
            <Tooltip title='Export' arrow disableFocusListener>
                <Button variant='outlined' size='small' onClick={handleExportClipboard}
                        style={{color: '#ddd', borderColor: '#ddd'}} startIcon={<ContentCopyIcon/>}>
                    Export
                </Button>
            </Tooltip>
        </React.Fragment>
    )
}

export default ExportThanksButton
