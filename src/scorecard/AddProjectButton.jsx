import React, {useState, useCallback} from 'react'
import EvidenceForm from '../scorecard/EvidenceForm.jsx'
import Backdrop from '@mui/material/Backdrop'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Button from '@mui/material/Button'

export default function AddProjectButton() {

    const [overlayIsOpen, setOverlayIsOpen] = useState(false)
    const handleOverlayOpen = useCallback(() => {
        setOverlayIsOpen(true)
    }, [])
    const handleOverlayClose = useCallback(() => {
        setOverlayIsOpen(false)
    }, [])

    return (
        <React.Fragment>
            <div>
                <Button color='secondary' size='small' onClick={handleOverlayOpen}>ADD PROJECT</Button>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={overlayIsOpen} onClick={null}
                >
                    <Card style={{
                        maxWidth: 600,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        border: '1px solid #666'
                    }}>
                        <CardHeader title={'Add Project'} action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                    style={{paddingBottom: 0}} onClick={handleOverlayClose}/>
                        <CardContent>
                            <EvidenceForm evid={null} handleUpdate={handleOverlayClose} addProject={true}/>
                        </CardContent>
                    </Card>
                </Backdrop>
            </div>

        </React.Fragment>
    )
}