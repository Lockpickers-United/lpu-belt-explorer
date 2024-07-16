import React, {useState, useContext} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DBContext from '../app/DBContext.jsx'
import entryName from '../entries/entryName.js'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'
import belts, {projectTiers, modifierMultiplier} from '../data/belts.js'
import {user2SysDate, sys2UserDate} from '../util/datetime.js'

import ScorecardRow from './ScorecardRow.jsx'

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

const possibleUpgrades = Object.keys(nextUpgrades)
    .reduce((group, term) => {
        group[term] = true
        nextUpgrades[term].forEach(id => {
            group[id] = true
        })
        return group
    }, {})

function isUpgradeOf(aId, bId) {
    if (!nextUpgrades[bId]) {
        return false
    } else if (nextUpgrades[bId].includes(aId)) {
        return true
    } else {
        return nextUpgrades[bId].some(id => isUpgradeOf(aId, id))
    }
}

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

function ScorecardRowDisplay({owner, evid, onEdit}) {

    return (
        <TableRow key={evid.row}>
            <TableCell align='left' style={{backgroundColor: evid.color}}>
                <Typography>{evid.row}</Typography>
            </TableCell>
            <TableCell align='center'>
                {owner &&
                    <IconButton size='small' onClick={() => onEdit(evid.id)}>
                        <EditIcon/>
                    </IconButton>
                }
            </TableCell>
            <TableCell align='left'>
                {evid.matchLink ?
                    <Link href={evid.matchLink} target='_blank' color='secondary'>
                        <Typography>{evid.matchName}</Typography>
                    </Link>
                    :
                    <Typography>{evid.matchName}</Typography>
                }
            </TableCell>
            <TableCell alight='left'>
                <Link href={evid.link} target='_blank' color='secondary'>
                    <Typography>{evid.name}</Typography>
                </Link>
            </TableCell>
            <TableCell align='left'>
                <Typography noWrap={true}>{evid.date}</Typography>
            </TableCell>
            <TableCell align='left'>
                <Typography>{evid.modifier}</Typography>
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

function Scorecard({owner, evidence}) {
    const {updateEvidence, removeEvidence, importUnclaimedEvidence} = useContext(DBContext)
    const [editRowId, setEditRowId] = useState(null)
    const [tabToImport, setTabToImport] = useState('')

    function handleEdit(id) {
        setEditRowId(id)
    }

    function handleSave(id, matchId, name, url, date, modifier) {
        setEditRowId(null)
        updateEvidence(id, {
            matchId: matchId,
            name: name,
            link: url,
            date: user2SysDate(date),
            modifier: modifier
        })
    }

    function handleCancel() {
        setEditRowId(null)
    }

    function handleDelete(id) {
        setEditRowId(null)
        removeEvidence(id)
    }

    function handleDeleteAll() {
        const ids = evidence.map(evid => evid.id)
        ids.forEach(id => removeEvidence(id))
    }

    function handleImport() {
        importUnclaimedEvidence(tabToImport)
        setTabToImport('')
    }

    const annotatedEvidence = evidence.map(ev => {
        const entry = allEntriesById[ev.matchId]
        const project = allProjectsById[ev.matchId]
        const dateStr = sys2UserDate(ev.date)
        const modifier = ev.modifier && ev.modifier !== 'Upgraded' ? ev.modifier : null
        const multiplier = modifier ? modifierMultiplier[modifier] : 1

        if (entry) {
            const name = entryName(entry)
            const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

            return {
                ...ev,
                matchId: entry.id,
                matchName: name,
                matchLink: `https://share.lpubelts.com/?id=${entry.id}&name=${safeName}`,
                color: belts[entry.belt].color,
                date: dateStr,
                modifier: modifier,
                points: multiplier * belts[entry.belt].danPoints,
                bbCount: entry.belt.startsWith('Black') ? 1 : 0
            }
        } else if (project) {
            return {
                ...ev,
                matchId: project.id,
                matchName: project.name,
                color: belts['Unranked'].color,
                date: dateStr,
                modifier: modifier,
                points: multiplier * projectTiers[project.tier].danPoints,
                bbCount: 0
            }
        } else {
            return {
                ...ev,
                matchName: '',
                color: belts['Unranked'].color,
                date: dateStr,
                modifier: modifier,
                points: 0,
                bbCount: 0
            }
        }
    })

    const sortedEvidence = annotatedEvidence.sort((a, b) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)
        if (aDate > bDate) {
            return -1
        } else if (aDate < bDate) {
            return 1
        } else {
            return a.name < b.name ? -1 : 1
        }
    })

    let scoredEvidence = []
    let usedIds = {}
    let upgradeableIdIdx = []

    for (let idx = sortedEvidence.length - 1; idx >= 0; idx--) {
        const ev = sortedEvidence[idx]

        if (!ev.matchId) {
            scoredEvidence[idx] = {
                ...ev,
                row: idx + 1,
                note: 'no match with lock or project'
            }
        } else if (!ev.link.startsWith('http')) {
            scoredEvidence[idx] = {
                ...ev,
                row: idx + 1,
                points: 0,
                bbCount: 0,
                note: 'no URL for evidence'
            }
        } else {
            const collidedIdx = usedIds[ev.matchId]

            if (collidedIdx && ev.points <= scoredEvidence[collidedIdx].points) {
                scoredEvidence[idx] = {
                    ...ev,
                    row: idx + 1,
                    points: 0,
                    note: `samelined with row ${collidedIdx + 1}`
                }
            } else {
                if (collidedIdx) {
                    scoredEvidence[collidedIdx] = {
                        ...sortedEvidence[collidedIdx],
                        row: collidedIdx + 1,
                        points: 0,
                        note: `samelined with row ${idx + 1}`
                    }
                }

                usedIds[ev.matchId] = idx
                let superseded = false

                if (possibleUpgrades[ev.matchId]) {
                    for (let jdx = 0; !superseded && jdx < upgradeableIdIdx.length; jdx++) {
                        const [upId, upIdx] = upgradeableIdIdx[jdx]

                        if (isUpgradeOf(upId, ev.matchId)) {
                            superseded = true

                            scoredEvidence[idx] = {
                                ...ev,
                                row: idx + 1,
                                points: 0,
                                note: `superseded by row ${upIdx + 1}`
                            }

                        } else if (isUpgradeOf(ev.matchId, upId)) {
                            scoredEvidence[upIdx] = {
                                ...scoredEvidence[upIdx],
                                row: upIdx + 1,
                                points: 0,
                                note: `superseded by row ${idx + 1}`
                            }
                        }
                    }
                    upgradeableIdIdx.push([ev.matchId, idx])
                }

                if (!superseded) {
                    scoredEvidence[idx] = {
                        ...ev,
                        row: idx + 1
                    }
                }
            }
        }
    }

    const [bbCount, danPoints] = scoredEvidence.reduce((group, ev) => {
        group[0] = group[0] + ev.bbCount
        group[1] = group[1] + ev.points
        return group
    }, [0, 0])

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: 'flex'}}>
                <div style={{marginLeft: 0}}>

                    {owner && scoredEvidence.length > 0 ?
                        <Button color='secondary' size='large' onClick={handleDeleteAll}>DELETE&nbsp;ALL</Button>
                        : owner &&
                        <div>
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
                            <Button color='secondary' size='small' sx={{margin: 1}}
                                    onClick={handleImport}>IMPORT</Button>
                        </div>
                    }
                </div>
                <div style={{
                    width: '100%',
                    textAlign: 'right',
                    padding: '10px 12px 8px 0px'
                }}>
                        <span style={{fontWeight: 700}}>{bbCount} Black Belt Lock{bbCount !== 1 &&
                            <span>s</span>}, </span>
                    <span style={{fontWeight: 700}}>{danPoints} Dan Point{danPoints !== 1 && <span>s</span>}</span>
                </div>

            </div>

            <div>
                {scoredEvidence.map(ev =>
                    <ScorecardRow key={ev.row} owner={owner} evid={ev} onEdit={handleEdit}
                                  allEntriesById={allEntriesById} allProjectsById={allProjectsById}/>
                )}
            </div>


            <div style={{marginTop: 50, paddingBottom: 32}}>
                <TableContainer component={Paper}>
                    <Table aria-label='scorecard'>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left'></TableCell>
                                <TableCell align='left'></TableCell>
                                <TableCell align='left'>
                                    <Typography>Lock / Project</Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography>Evidence</Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography>Date</Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography>Modifier</Typography>
                                </TableCell>
                                <TableCell align='right'>
                                    <Typography>BBs</Typography>
                                </TableCell>
                                <TableCell align='right'>
                                    <Typography>Points</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scoredEvidence.map(ev => {
                                if (ev.id === editRowId) {
                                    return <ScorecardRowEdit key={ev.row} evid={ev} onSave={handleSave}
                                                             onCancel={handleCancel} onDelete={handleDelete}/>
                                } else {
                                    return <ScorecardRowDisplay key={ev.row} owner={owner} evid={ev}
                                                                onEdit={handleEdit}/>
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default Scorecard
