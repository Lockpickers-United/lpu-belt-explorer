import React, {useState} from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import entryName from '../entries/entryName'
import {user2SysDate} from '../util/datetime'

function ScorecardRowEdit({evid, onSave, onCancel, onDelete}) {
    const [lockProjectId, setLockProjectId] = useState(evid.matchId)
    const [lockProjectIdErr, setLockProjectIdErr] = useState(null)
    const [evidenceName, setEvidenceName] = useState(evid.name)
    const [evidenceNameErr, setEvidenceNameErr] = useState(null)
    const [evidenceUrl, setEvidenceUrl] = useState(evid.link)
    const [evidenceUrlErr, setEvidenceUrlErr] = useState(null)
    const [evidenceDate, setEvidenceDate] = useState(evid.date)
    const [evidenceDateErr, setEvidenceDateErr] = useState(null)
    const [modifier, setModifier] = useState(evid.modifier)

    function handleSave() {
        let error = false
        if (!allEntriesById[lockProjectId] && !allProjectsById[lockProjectId]) {
            setLockProjectIdErr('Must match to lock or project')
            error = true
        }
        if (evidenceName.length === 0) {
            setEvidenceNameErr('Evidence Name cannot be empty')
            error = true
        }
        if (!evidenceUrl || !evidenceUrl.startsWith('http')) {
            setEvidenceUrlErr('Must specify valid URL')
            error = true
        }
        if (!user2SysDate(evidenceDate)) {
            setEvidenceDateErr('Invalid date format: use yyyy-mm-dd')
            error = true
        }
        if (!error) {
            onSave(evid.id, lockProjectId, evidenceName, evidenceUrl, evidenceDate, modifier)
        }
    }

    let matchName = '(Unknown Id)'

    if (allEntriesById[lockProjectId]) {
        matchName = entryName(allEntriesById[lockProjectId], 'short', {includeVersion: true})
    } else if (allProjectsById[lockProjectId]) {
        matchName = allProjectsById[lockProjectId].name
    }

    return (
        <TableRow key={evid.row}>
            <TableCell align='center'>
                <Button color='secondary' onClick={handleSave}>Save</Button>
            </TableCell>
            <TableCell align='center'>
                <Stack direction='column' spacing={2}>
                    <Button color='secondary' onClick={onCancel}>Cancel</Button>
                    <Button color='secondary' onClick={() => onDelete(evid.id)}>Delete</Button>
                </Stack>
            </TableCell>
            <TableCell align='left'>
                <Stack direction='column'>
                    <TextField
                        id='lock-project-id'
                        error={!!lockProjectIdErr}
                        helperText={lockProjectIdErr}
                        label='Lock / Project Id'
                        value={lockProjectId}
                        size='small'
                        margin='dense'
                        color='secondary'
                        onChange={e => {
                            setLockProjectIdErr(null)
                            setLockProjectId(e.target.value)
                        }}
                    />
                    <Typography sx={{margin: 2}}>{matchName}</Typography>
                </Stack>
            </TableCell>
            <TableCell align='left'>
                <Stack direction='column'>
                    <TextField
                        id='evidence-name'
                        error={!!evidenceNameErr}
                        helperText={evidenceNameErr}
                        label='Evidence Name'
                        value={evidenceName}
                        size='small'
                        margin='dense'
                        color='secondary'
                        onChange={e => {
                            setEvidenceNameErr(null)
                            setEvidenceName(e.target.value)
                        }}
                    />
                    <TextField
                        id='evidence-url'
                        error={!!evidenceUrlErr}
                        helperText={evidenceUrlErr}
                        label='Evidence Link'
                        value={evidenceUrl}
                        placeholder='https://youtu.be/'
                        size='small'
                        margin='dense'
                        color='secondary'
                        onChange={e => {
                            setEvidenceUrlErr(null)
                            setEvidenceUrl(e.target.value)
                        }}
                    />
                </Stack>
            </TableCell>
            <TableCell align='left'>
                <TextField
                    id='evidence-date'
                    error={!!evidenceDateErr}
                    helperText={evidenceDateErr}
                    label='Evidence Date'
                    value={evidenceDate}
                    placeholder='yyyy-mm-dd'
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setEvidenceDateErr(null)
                        setEvidenceDate(e.target.value)
                    }}
                />
            </TableCell>
            <TableCell align='left'>
                <Select
                    id='modifier'
                    label='Modifier'
                    value={modifier ?? ''}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setModifier(e.target.value)
                    }}
                >
                    <MenuItem value=''>(None)</MenuItem>
                    <MenuItem value='First Recorded Pick'>First Recorded Pick</MenuItem>
                    <MenuItem value='First Recorded Pick (Notable)'>First Recorded Pick (Notable)</MenuItem>
                    <MenuItem value='Non-Picking Defeat'>Non-Picking Defeat</MenuItem>
                    <MenuItem value='First Recorded Defeat'>First Recorded Defeat</MenuItem>
                    <MenuItem value='First Recorded Defeat (Notable)'>First Recorded Defeat (Notable)</MenuItem>
                </Select>
            </TableCell>
            <TableCell align='right'>
                <Typography>{evid.bbCount}</Typography>
            </TableCell>
            <TableCell align='right'>
                <Tooltip title={evid.note}>
                    <Typography>{evid.points}</Typography>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

const allEntriesById = allEntries
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

const allProjectsById = allProjects
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

export default ScorecardRowEdit

