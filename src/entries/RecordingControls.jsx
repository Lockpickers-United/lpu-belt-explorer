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

function RecordingControls({lockId, makeModels}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {evidence, addEvidence, updateEvidence, removeEvidence} = useContext(DBContext)
    const [editRecId, setEditRecId] = useState(null)
    const recordings = evidence.filter(evid => evid.matchId === lockId)

    console.log('recordings', recordings)

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
            recordings.map(rec => {
                if (editRecId !== rec.id) {
                    return (
                        <div key={rec.id}>
                            <Stack direction='row' alignItems='center'>
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
                                <IconButton edge='start' onClick={() => setEditRecId(rec.id)}>
                                    <EditIcon style={{width: 22, height: 22}}/>
                                </IconButton>
                                <ScorecardEvidenceButton url={rec.link}/>
                            </Stack>
                        </div>
                    )
                } else {
                    return (
                        <div key={rec.id}>
                            <RecordingAddEdit
                                id={rec.id}
                                defName={rec.name}
                                defLink={rec.link}
                                defDate={rec.date}
                                onSave={params => handleSave(params, lockId, rec.modifier)}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                            />
                        </div>
                    )
                }
            }).concat([
                editRecId === 0
                    ? <div key='0'>
                        <RecordingAddEdit
                            id={0}
                            defName={makeModels[0].make + ' ' + makeModels[0].model}
                            onSave={params => handleSave(params, lockId, '')}
                            onCancel={handleCancel}
                        />
                    </div>
                    : recordings.length === 0 &&
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
                                            checked={editRecId === 0}
                                            onChange={null}
                                        />
                                    }
                                    label={'Scorecard'}
                                />
                            </FormGroup>
                        </Stack>
                    </div>
            ])}
        </React.Fragment>
    )
}

export default RecordingControls
