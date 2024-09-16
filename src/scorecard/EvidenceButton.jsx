import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'

import ListAltIcon from '@mui/icons-material/ListAlt'
import EvidenceForm from './EvidenceForm.jsx'
import Backdrop from '@mui/material/Backdrop'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ScoringContext from '../context/ScoringContext.jsx'

function EvidenceButton({id}) {

    const [editRecId, setEditRecId] = useState(null)
    const {scoredEvidence} = useContext(ScoringContext)

    const recordings = scoredEvidence
        .filter(evid => evid.matchId === id)
        .sort((a, b) => {
            return b.points - a.points
        }).filter(x => x)

    const handleOverlayOpen = useCallback(id => {
        setEditRecId(id)
    }, [])

    const handleOverlayClose = useCallback(() => {
        setEditRecId(null)
    }, [])

    return (
        <React.Fragment>
            <Tooltip title='My Collection' arrow disableFocusListener>
                <IconButton
                    variant='outlined'
                    color='inherit'
                    onClick={handleOverlayOpen}
                >
                    <ListAltIcon color={recordings.length > 0 ? 'secondary' : 'inherit'} fontSize='medium'/>
                </IconButton>
            </Tooltip>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={!!editRecId} onClick={null}
            >
                {!!editRecId &&
                    <Card style={{
                        maxWidth: 600,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        border: '1px solid #666',
                        opacity: 1
                    }}>
                        <CardHeader title={'Documentation'}
                                    action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                    style={{paddingBottom: 0}}
                                    onClick={handleOverlayClose}/>
                        <CardContent>
                            {recordings.map((rec, index) =>
                                <EvidenceForm evid={rec} handleUpdate={handleOverlayClose} source={'collectionButton'}
                                              key={index}/>
                            )}
                            {recordings.length === 0 &&
                                <EvidenceForm evid={null} lockId={id} handleUpdate={handleOverlayClose}
                                              source={'collectionButton'}/>
                            }
                        </CardContent>
                    </Card>
                }
            </Backdrop>

        </React.Fragment>
    )
}

export default EvidenceButton
