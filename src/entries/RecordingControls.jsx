import React, {useState, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import AddLinkIcon from '@mui/icons-material/AddLink'
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import DBContext from '../app/DBContext'
import {user2SysDate} from '../util/datetime'
import AddEditRecording from './AddEditRecording.jsx'

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
                if (editRecId !== rec.id) {
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
