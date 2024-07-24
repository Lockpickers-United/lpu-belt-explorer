import React, {useCallback, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DBContext from '../app/DBContext.jsx'
import useWindowSize from '../util/useWindowSize.jsx'


export default function ImportDanSheetForm({setControlsExpanded}) {
    const {importUnclaimedEvidence} = useContext(DBContext)
    const {isMobile} = useWindowSize()


    const [tabToImport, setTabToImport] = useState('')

    const handleImport = useCallback(() => {
        importUnclaimedEvidence(tabToImport)
        setTabToImport('')
        setControlsExpanded(false)
    }, [importUnclaimedEvidence, tabToImport, setControlsExpanded])

    const formDisplayStyle = isMobile ? 'block' : 'flex'

    return (
        <React.Fragment>
            <div style={{placeItems:'center', display:formDisplayStyle}}>
                <div style={{padding: 20, width: 340}}>
                    For Black Belts only. Specify your tab in the Dan Sheet to import. Please note that tab names are
                    case sensitive.
                </div>
                <div style={{padding: '0px', textAlign: 'center', display: 'flex', marginLeft:20, width: 340}}>
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
                    <Button style={{color: '#000', padding:0, lineHeight:'1rem', height:40, marginTop:8, marginLeft:10}}
                            variant='contained'
                            onClick={handleImport}
                            edge='start'
                            color='secondary'
                    >
                        Import
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}