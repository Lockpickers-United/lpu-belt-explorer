import React, {useState, useContext, useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import AddLinkIcon from '@mui/icons-material/AddLink'
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import DBContext from '../app/DBContext'
import {user2SysDate} from '../util/datetime'
import RecordingAddEdit from './RecordingAddEdit.jsx'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import AuthContext from '../app/AuthContext.jsx'
import FormGroup from '@mui/material/FormGroup'
import ScorecardEvidenceButton from '../scorecard/ScorecardEvidenceButton.jsx'
import EvidenceForm from '../scorecard/EvidenceForm.jsx'
import Backdrop from '@mui/material/Backdrop'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ScoringContext from '../context/ScoringContext.jsx'

function RecordingControls({lockId, makeModels}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {evidence, addEvidence, updateEvidence, removeEvidence} = useContext(DBContext)
    const [editRecId, setEditRecId] = useState(null)
    const {scoredEvidence} = useContext(ScoringContext)

    const recordings = scoredEvidence
        .filter(evid => evid.matchId === lockId)
        .sort((a, b) => {
            return b.points - a.points
        })

    console.log('recordings', recordings)

    const [overlayIsOpen, setOverlayIsOpen] = useState(false)
    const handleOverlayOpen = useCallback((rec) => {
        setOverlayIsOpen(true)
        setEditRecId(rec ? rec.id : null)
    }, [])
    const handleOverlayClose = useCallback(() => {
        setOverlayIsOpen(false)
    }, [])

    const handleSave = useCallback((params, lockId, modifier) => {
        setEditRecId(null)

        if (params.id === 0) {
            addEvidence({
                matchId: lockId,
                name: params.lockName,
                link: params.recUrl,
                date: user2SysDate(params.recDate),
                modifier: modifier
            })
        } else {
            updateEvidence(params.id, {
                matchId: lockId,
                name: params.lockName,
                link: params.recUrl,
                date: user2SysDate(params.recDate),
                modifier: modifier
            })
        }
    }, [addEvidence, updateEvidence])

    const handleCancel = useCallback(() => {
        setEditRecId(null)
    }, [])

    const handleDelete = useCallback((id) => {
        setEditRecId(null)
        removeEvidence(id)
    }, [removeEvidence])

    return (
        <React.Fragment> {
            recordings.map((rec, index) => {
                    return (
                        <div key={rec.id}>
                            <Stack direction='row' alignItems='center'>
                                {index===0 &&
                                <FormGroup>
                                    <FormControlLabel
                                        key={'scorecard'}
                                        control={
                                            <Checkbox
                                                id={'scorecard'}
                                                disabled={!isLoggedIn}
                                                color='secondary'
                                                checked={recordings.length > 0}
                                                onChange={null}
                                            />
                                        }
                                        label={'Scorecard'}
                                    />
                                </FormGroup>
                                }
                                {index > 0 &&
                                <div style={{margin:'0px 15px 0px 38px', color:'#bbb'}}>Duplicate</div>
                                }
                                <IconButton edge='start' onClick={() => handleOverlayOpen(rec)}>
                                    <EditIcon style={{width: 22, height: 22}}/>
                                </IconButton>
                                <ScorecardEvidenceButton url={rec.link}/>
                            </Stack>
                            <Backdrop
                                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                                open={overlayIsOpen} onClick={handleOverlayClose}
                            >
                                <Card style={{
                                    maxWidth: 600,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    border: '1px solid #666'
                                }}>
                                    <CardHeader title={'Documentation'} action={<HighlightOffIcon/>} style={{paddingBottom: 0}}/>
                                    <CardContent>
                                        <EvidenceForm evid={rec}/>
                                    </CardContent>
                                </Card>
                            </Backdrop>

                        </div>
                    )

            }).concat([
                recordings.length === 0 &&
                    <div key='0'>
                        <Stack direction='row' alignItems='center' onClick={() => setEditRecId(0)}>
                            <FormGroup>
                                <FormControlLabel
                                    key={'scorecard'}
                                    control={
                                        <Checkbox
                                            id={'scorecard'}
                                            disabled={!isLoggedIn}
                                            color='secondary'
                                            checked={recordings.length > 0}
                                            onClick={() => handleOverlayOpen(null)}
                                        />
                                    }
                                    label={'Scorecard'}
                                />
                            </FormGroup>
                        </Stack>
                        <Backdrop
                            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                            open={overlayIsOpen} onClick={null}
                        >
                            <Card style={{
                                maxWidth: 600,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                border: '1px solid #666'
                            }}>
                                <CardHeader title={'Documentation'} action={<HighlightOffIcon/>} style={{paddingBottom: 0}} onClick={handleOverlayClose}/>
                                <CardContent>
                                    <EvidenceForm evid={null} lockId={lockId}/>
                                </CardContent>
                            </Card>
                        </Backdrop>

                    </div>
            ])}
        </React.Fragment>
    )
}

export default RecordingControls
