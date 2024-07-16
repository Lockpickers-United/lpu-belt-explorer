import React, {useState, useContext} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DBContext from '../app/DBContext.jsx'
import entryName from '../entries/entryName'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'
import belts, {projectTiers, modifierMultiplier} from '../data/belts'
import {user2SysDate, sys2UserDate} from '../util/datetime'

import ScorecardRow from './ScorecardRow.jsx'
import ScorecardRowEdit from './ScorecardRowEdit.jsx'
import ScorecardRowDisplay from './ScorecardRowDisplay.jsx'

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

export default Scorecard
