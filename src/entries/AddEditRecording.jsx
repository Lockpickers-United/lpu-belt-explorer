import React, {useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import {user2SysDate, sys2UserDate, now2UserDate} from '../util/datetime'

function AddEditRecording({id, defName, defLink, defDate, onSave, onCancel, onDelete}) {
    const dateStr = defDate ? sys2UserDate(defDate) : id === 0 && now2UserDate
    const [lockName, setLockName] = useState(defName)
    const [lockNameErr, setLockNameErr] = useState(null)
    const [recUrl, setRecUrl] = useState(defLink)
    const [recUrlErr, setRecUrlErr] = useState(null)
    const [recDate, setRecDate] = useState(dateStr)
    const [recDateErr, setRecDateErr] = useState(null)

    function handleSave() {
        let error = false
        if (lockName.length === 0) {
            setLockNameErr('Lock Name cannot be empty')
            error = true
        }
        if (!recUrl || !recUrl.startsWith('http')) {
            setRecUrlErr('Must specify valid URL')
            error = true
        }
        if (!user2SysDate(recDate)) {
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

export default AddEditRecording
