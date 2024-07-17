import React, {useState, useContext, useCallback, useDeferredValue} from 'react'
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
import {user2SysDate} from '../util/datetime'

import ScorecardRow from './ScorecardRow.jsx'
import ScorecardRowEdit from './ScorecardRowEdit.jsx'
import ScorecardRowDisplay from './ScorecardRowDisplay.jsx'
import ScorecardListContext from './ScorecardListContext.jsx'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import {enqueueSnackbar} from 'notistack'

function Scorecard({owner}) {
    const {visibleEntries, allEntriesById, allProjectsById = []} = useContext(ScorecardDataContext)
    const {updateEvidence, removeEvidence, importUnclaimedEvidence} = useContext(DBContext)
    const [editRowId, setEditRowId] = useState(null)
    const [tabToImport, setTabToImport] = useState('')
    const {expanded, setExpanded} = useContext(ScorecardListContext)
    const {scoredEvidence, bbCount, danPoints} = useContext(ScorecardDataContext)

    const defExpanded = useDeferredValue(expanded)

    console.log('visibleEntries', visibleEntries)

    const handleEdit = useCallback(id => {
        setEditRowId(id)
    }, [])

    const handleSave = useCallback( async (id, matchId, name, url, date, modifier) => {
        try {
            setEditRowId(null)
            updateEvidence(id, {
                matchId: matchId,
                name: name,
                link: url,
                date: user2SysDate(date),
                modifier: modifier
            })
            enqueueSnackbar('Scorecard updated')
        } catch (ex) {
            console.error('Error while updating scorecard', ex)
            enqueueSnackbar('Error while updating scorecard')
        }
    }, [updateEvidence])

    const handleDelete = useCallback(async id => {
        try {
        setEditRowId(null)
        removeEvidence(id)
            enqueueSnackbar('Entry deleted')
        } catch (ex) {
            console.error('Error while deleting entry', ex)
            enqueueSnackbar('Error while deleting entry')
        }
    }, [removeEvidence])

    const handleCancel = useCallback(() => {
        setEditRowId(null)
    }, [])

    const handleDeleteAll = useCallback(() => {
        const ids = scoredEvidence.map(evid => evid.id)
        ids.forEach(id => removeEvidence(id))
    }, [scoredEvidence, removeEvidence])

    const handleImport = useCallback(() => {
        importUnclaimedEvidence(tabToImport)
        setTabToImport('')
    }, [tabToImport, importUnclaimedEvidence])

    const table = false
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: 'flex'}}>
                <div style={{marginLeft: 0}}>

                    {owner && visibleEntries.length > 0 ?
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
                    <ScoringExceptions/>
                    <span style={{fontWeight: 700}}>{bbCount} Black Belt Lock{bbCount !== 1 &&
                        <span>s</span>}, </span>
                    <span style={{fontWeight: 700}}>{danPoints} Dan Point{danPoints !== 1 && <span>s</span>}</span>
                </div>

            </div>

            <div>
                {visibleEntries.map(ev =>
                    <ScorecardRow key={ev.id}
                                  owner={owner}
                                  evid={ev}
                                  onEdit={handleEdit}
                                  expanded={ev.id === defExpanded}
                                  onExpand={setExpanded}
                                  onSave={handleSave}
                                  onDelete={handleDelete}
                                  allEntriesById={allEntriesById}
                                  allProjectsById={allProjectsById}/>
                )}
            </div>

            {table &&
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
                            {visibleEntries.map(ev => {
                                if (ev.id === editRowId) {
                                    return <ScorecardRowEdit key={ev.id} evid={ev} onSave={handleSave}
                                                             onCancel={handleCancel} onDelete={handleDelete}/>
                                } else {
                                    return <ScorecardRowDisplay key={ev.id} owner={owner} evid={ev}
                                                                onEdit={handleEdit}/>
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            }
        </div>
    )
}

export default Scorecard
