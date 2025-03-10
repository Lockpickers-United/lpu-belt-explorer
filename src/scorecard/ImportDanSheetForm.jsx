import React, {useCallback, useContext, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LoadingDisplay from '../misc/LoadingDisplay'
import DBContext from '../app/DBContext'
import useWindowSize from '../util/useWindowSize'
import Link from '@mui/material/Link'

export default function ImportDanSheetForm({setControlsExpanded, adminAction}) {
    const {userId} = useParams()
    const {importUnclaimedEvidence} = useContext(DBContext)
    const {isMobile} = useWindowSize()
    const [importing, setImporting] = useState(false)
    const navigate = useNavigate()

    const [tabToImport, setTabToImport] = useState('')
    const [tabImportError, setTabImportError] = useState(null)

    const handleImport = useCallback(async () => {
        setImporting(true)
        const result = await importUnclaimedEvidence(userId, tabToImport)
        setImporting(false)

        if (result) {
            setTabToImport('')
            setControlsExpanded(false)
            adminAction()
        } else {
            setTabImportError('Cannot find dan sheet tab')
        }
    }, [importUnclaimedEvidence, userId, tabToImport, setControlsExpanded, adminAction])

    const formDisplayStyle = isMobile ? 'block' : 'flex'
    const fontSize = isMobile ? '0.95rem' : '1rem'

    return (
        <React.Fragment>
            <div style={{placeItems: 'center', display: formDisplayStyle}}>
                {importing ?
                    <LoadingDisplay/>
                    :
                    <React.Fragment>
                        <div style={{padding: 20, fontSize}}>
                            <strong>For Black Belt pickers only.</strong><br/>
                            Black Belt pickers currently use another scorecard system known as the Dan Sheet.
                            This import allows them to bring their picking history over to the site.
                            If you do not already have a tab in the Dan sheet, this import will not work for you.
                            For those that do, specify the name of your tab in the sheet to import your history into
                            your Scorecard.
                            Please note that tab names are case sensitive. <Link onClick={() => {
                                navigate('/profile/scorecard/howto')
                            }} style={{color: '#bbb', cursor: 'pointer'}}>Click here to learn more.</Link>

                            <br/><br/>

                            <div style={{padding: '0px', alignItems: 'center'}}>
                                <div style={{padding: '0px', display: 'flex'}}>
                                    <div style={{flexGrow: 1}}></div>
                                    <TextField
                                        id='tab-to-import'
                                        label='Tab to Import'
                                        value={tabToImport}
                                        size='small'
                                        error={!!tabImportError}
                                        helperText={tabImportError}
                                        margin='dense'
                                        color='secondary'
                                        onChange={e => {
                                            setTabToImport(e.target.value)
                                        }}
                                    />
                                    <Button style={{
                                        color: '#000',
                                        padding: 0,
                                        lineHeight: '1rem',
                                        height: 40,
                                        marginTop: 8,
                                        marginLeft: 10
                                    }}
                                            variant='contained'
                                            onClick={handleImport}
                                            edge='start'
                                            color='secondary'
                                    >
                                        Import
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}