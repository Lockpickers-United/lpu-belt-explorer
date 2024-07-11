import React, {useState, useContext} from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AddLinkIcon from '@mui/icons-material/AddLink'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import DBContext from '../app/DBContext'

function AddEditRecording({id, defName, defLink, defDate, onSave, onCancel, onDelete}) {
    const date = defDate ? new Date(defDate) : new Date()
    const dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    const [lockName, setLockName] = useState(defName)
    const [lockNameErr, setLockNameErr] = useState(null)
    const [recUrl, setRecUrl] = useState(defLink)
    const [recUrlErr, setRecUrlErr] = useState(null)
    const [recDate, setRecDate] = useState(dateStr)
    const [recDateErr, setRecDateErr] = useState(null)

    function handleSave() {
        let error = false
        if (lockName.length == 0) {
            setLockNameErr('Lock Name cannot be empty')
            error = true
        }
        if (!recUrl || !recUrl.startsWith('http')) {
            setRecUrlErr('Must specify valid URL')
            error = true
        }
        if (isNaN(Date.parse(recDate))) {
            setRecDateErr('Invalid date format: use yyyy-mm-dd')
            error = true
        }
        if (!error) {
            onSave({id, lockName, recUrl, recDate})
        }
    }

    return (
        <React.Fragment>
            <Stack direction='column'>
                <TextField
                    id='lock-name'
                    error={!!lockNameErr}
                    helperText={lockNameErr}
                    label='Lock Name'
                    defaultValue={lockName}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setLockNameErr(null)
                        setLockName(e.target.value)
                    }}
                />
                <TextField
                    id='recording-url'
                    error={!!recUrlErr}
                    helperText={recUrlErr}
                    label='Recording URL'
                    defaultValue={recUrl}
                    placeholder='https://youtu.be/'
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setRecUrlErr(null)
                        setRecUrl(e.target.value)
                    }}
                />
                <TextField
                    id='date-recorded'
                    error={!!recDateErr}
                    helperText={recDateErr}
                    label='Date Recorded'
                    defaultValue={recDate}
                    placeholder='yyyy-mm-dd'
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setRecDateErr(null)
                        setRecDate(e.target.value)
                    }}
                />
            </Stack>
            <Stack direction='row' alignItems='center'>
                <Button color='secondary' onClick={handleSave}>Save</Button>
                <Button color='secondary' onClick={onCancel}>Cancel</Button>
                {onDelete && <Button color='secondary' onClick={() => onDelete(id)}>Delete</Button>}
            </Stack>
        </React.Fragment>
    )
}

function RecordingControls({lockId, makeModels}) {
    const {evidence, addEvidence, updateEvidence, removeEvidence} = useContext(DBContext)
    const [editRecId, setEditRecId] = useState(null)
    const recordings = evidence.filter(evid => evid.matchId === lockId)

    function handleSave(params, lockId, modifier) {
        setEditRecId(null)

        if (params.id === 0) {
            addEvidence({
                matchId: lockId,
                name: params.lockName,
                link: params.recUrl,
                date: new Date(params.recDate).toJSON(),
                modifier: modifier
            })
        } else {
            updateEvidence(params.id, {
                matchId: lockId,
                name: params.lockName,
                link: params.recUrl,
                date: new Date(params.recDate).toJSON(),
                modifier: modifier
            })
        }
    }

    function handleCancel() {
        setEditRecId(null)
    }

    function handleDelete(id) {
        setEditRecId(null)
        removeEvidence(id)
    }

    return (
        <React.Fragment> {
            recordings.map(rec => {
                if (editRecId != rec.id) {
                    return (
                        <div key={rec.id}>
                            <Stack direction='row' alignItems='center'>
                                <IconButton edge='start' onClick={() => setEditRecId(rec.id)}>
                                    <EditIcon/>
                                </IconButton>
                                <Link href={rec.link} target='_blank' color='secondary'>
                                    <Typography noWrap={true}>{rec.name}</Typography>
                                </Link>
                            </Stack>
                        </div>
                    )
                } else {
                    return (
                        <div key={rec.id}>
                            <AddEditRecording
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
                editRecId === 0 ?
                    <div key='0'>
                        <AddEditRecording
                            id={0}
                            defName={makeModels[0].make + ' ' + makeModels[0].model}
                            onSave={params => handleSave(params, lockId, '')}
                            onCancel={handleCancel}
                        />
                    </div>
                : recordings.length === 0 &&
                    <div key='0'>
                        <Stack direction='row' alignItems='center' onClick={() => setEditRecId(0)}>
                            <IconButton edge='start'>
                                <AddLinkIcon/>
                            </IconButton>
                            <Typography>Add Recording</Typography>
                        </Stack>
                    </div>
            ])}
        </React.Fragment>
    )
}

export default RecordingControls
