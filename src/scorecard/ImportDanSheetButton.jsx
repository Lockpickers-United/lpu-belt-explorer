import React, {useCallback, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DBContext from '../app/DBContext.jsx'
import Menu from '@mui/material/Menu'


export default function ImportDanSheetButton({owner, cardEvidence}) {
    const {removeAllEvidence, importUnclaimedEvidence} = useContext(DBContext)

    const [tabToImport, setTabToImport] = useState('')

    const handleDeleteAll = useCallback(() => {
        removeAllEvidence()
    }, [removeAllEvidence])

    const handleImport = useCallback(() => {
        importUnclaimedEvidence(tabToImport)
        setTabToImport('')
    }, [tabToImport, importUnclaimedEvidence])

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    return (
        <React.Fragment>
            {
                owner && cardEvidence.length > 0
                    ? <div>
                        <Button color='secondary' size='small' onClick={handleDeleteAll}>DELETE ALL</Button>
                    </div>
                    : owner &&
                    <div style={{display:'block'}}>
                        <Button color='secondary' size='small' sx={{margin: 1}}
                                onClick={handleOpen}>
                            IMPORT DAN SHEET
                        </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <div style={{padding: 20, width:300}}>
                                For Black Belts only. Specify your tab in the Dan Sheet to import. Please note that tab names are case sensitive.
                            </div>
                            <div style={{padding: '0px', textAlign: 'center', width:300}}>
                            <TextField
                                id='tab-to-import'
                                label='Tab to Import'
                                value={tabToImport}
                                size='small'
                                margin='dense'
                                color='secondary'
                                onChange={e => {
                                    setTabToImport(e.target.value)
                                }}
                            />
                            </div>
                            <div style={{textAlign: 'center', padding:10}}>
                                <Button style={{marginBottom: 10, color: '#000'}}
                                        variant='contained'
                                        onClick={handleImport}
                                        edge='start'
                                        color='secondary'
                                >
                                    Import
                                </Button>
                            </div>
                        </Menu>

                    </div>
            }
        </React.Fragment>
    )
}