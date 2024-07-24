import React, {useCallback, useContext} from 'react'
import Button from '@mui/material/Button'
import DBContext from '../app/DBContext.jsx'

export default function ImportDanSheetButton({cardEvidence, handleOpenControls}) {
    const {removeAllEvidence} = useContext(DBContext)

    const handleDeleteAll = useCallback(() => {
        removeAllEvidence()
    }, [removeAllEvidence])

    return (
        <React.Fragment>
            {
                cardEvidence.length > 0
                    ? <Button color='secondary' size='small' style={{lineHeight:'1rem'}} onClick={handleDeleteAll}>DELETE ALL</Button>
                    : <Button color='secondary' size='small' style={{lineHeight:'1rem'}} onClick={handleOpenControls}>
                        IMPORT DAN SHEET
                    </Button>
            }
        </React.Fragment>
    )
}