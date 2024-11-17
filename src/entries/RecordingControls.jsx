import React, {useState, useContext, useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack'
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
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import useWindowSize from '../util/useWindowSize.jsx'

function RecordingControls({lockId, dense}) {

    const {isLoggedIn} = useContext(AuthContext)
    const [editRecId, setEditRecId] = useState(null)
    const {scoredActivity} = useContext(ScoringContext)
    const {isMobile} = useWindowSize()

    const recordings = scoredActivity
        .filter(evid => evid.matchId === lockId)
        .sort((a, b) => {
            return b.points - a.points
        })

    const handleOverlayOpen = useCallback(id => {
        console.log('handleOverlayOpen', id)
        setEditRecId(id)
    }, [])

    const handleOverlayClose = useCallback(() => {
        setEditRecId(null)
    }, [])

    return (
        <React.Fragment>

            {recordings.map((rec, index) => {
                return (
                    <div key={rec.id}>
                        <Stack direction='row' alignItems='center'>
                            {index === 0 &&
                                <React.Fragment>
                                    {dense &&
                                        <React.Fragment>
                                            {recordings.map((rec, index) => {
                                                    return (
                                                        <div key={rec.id}>
                                                            {index === 0 &&
                                                                <IconButton onClick={() => handleOverlayOpen(rec.id)}
                                                                            style={{color: '#18aa18', padding: isMobile ? 5 : 7}}>
                                                                    <VideocamOutlinedIcon fontSize={isMobile ? 'small' : 'medium'}/>
                                                                </IconButton>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </React.Fragment>
                                    }
                                    {!dense &&
                                        <FormGroup>
                                            <FormControlLabel
                                                key={'scorecard'}
                                                control={
                                                    <Checkbox
                                                        id={'scorecard'}
                                                        disabled={!isLoggedIn}
                                                        color='secondary'
                                                        checked={recordings.length > 0}
                                                        onChange={() => handleOverlayOpen(rec.id)}
                                                    />
                                                }
                                                label={'Scorecard'}
                                            />
                                        </FormGroup>
                                    }
                                </React.Fragment>

                            }
                            {index > 0 &&
                                <div style={{margin: '0px 15px 0px 38px', color: '#bbb'}}>Duplicate</div>
                            }
                            {!dense &&
                                <React.Fragment>
                                    <IconButton edge='start' onClick={() => handleOverlayOpen(rec.id)}>
                                        <EditIcon style={{width: 22, height: 22}}/>
                                    </IconButton>
                                    <ScorecardEvidenceButton activity={rec}/>
                                </React.Fragment>
                            }
                        </Stack>
                        {editRecId === rec.id &&
                            <Backdrop
                                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                                open={editRecId === rec.id} onClick={null}
                            >
                                <Card style={{
                                    maxWidth: 600,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    border: '1px solid #666'
                                }}>
                                    <CardHeader title={'Documentation'}
                                                action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                                style={{paddingBottom: 0}} onClick={handleOverlayClose}/>
                                    <CardContent>
                                        <EvidenceForm activity={rec} handleUpdate={handleOverlayClose}
                                                      source={'collectionButton'}/>
                                    </CardContent>
                                </Card>
                            </Backdrop>
                        }
                    </div>
                )

            }).concat([
                recordings.length === 0 &&
                <div key='0'>
                    {dense &&
                        <div>
                            <IconButton onClick={() => handleOverlayOpen(0)} style={{padding: isMobile ? 5 : 7}}>
                                <VideocamOutlinedIcon fontSize={isMobile ? 'small' : 'medium'}/>
                            </IconButton>
                        </div>
                    }
                    {!dense &&
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
                                            onClick={() => handleOverlayOpen(0)}
                                        />
                                    }
                                    label={'Scorecard'}
                                />
                            </FormGroup>
                        </Stack>
                    }
                    {editRecId === 0 &&
                        <Backdrop
                            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                            open={editRecId === 0} onClick={null}
                        >
                            <Card style={{
                                maxWidth: 600,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                border: '1px solid #666'
                            }}>
                                <CardHeader title={'Documentation'}
                                            action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                            style={{paddingBottom: 0}}
                                            onClick={handleOverlayClose}/>
                                <CardContent>
                                    <EvidenceForm activity={null} lockId={lockId} handleUpdate={handleOverlayClose}
                                                  source={'collectionButton'} owner={true}/>
                                </CardContent>
                            </Card>
                        </Backdrop>
                    }
                </div>
            ])}
        </React.Fragment>
    )
}

export default RecordingControls
