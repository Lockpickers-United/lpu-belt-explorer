import React, {useCallback, useState} from 'react'
import SystemMessage from '../../systemMessage/SystemMessage.jsx'
import routes from '../../app/routes.jsx'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'

export default function SystemMessagePreview() {

    const allPages = [...new Set(routes.reduce((acc, route) => {
        const noId = route.path.replace('/:userId', '')
        acc.push(noId)

        if (route.children) {
            route.children.map(child => {
                const noId = child.path.replace('/:userId', '')
                acc.push(noId)
            })
        }
        return acc
    }, []))].sort()

    const [pageId, setPageId] = useState('*')
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const handleToggleControls = useCallback(() => {
        setControlsExpanded(!controlsExpanded)
    }, [controlsExpanded])

    const placeholderMessage = {
        id: '007',
        status: 'active',
        description: 'placeholder',
        messageType: 'Placeholder',
        linkText: 'OK',
        priority: 0,
        messageHeadline: 'No Matching Messages.',
        messageText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        noDismiss: true,
        textColor: '#555'
    }

    return (
        <div style={{
            textAlign: 'center',
            width: 760,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20
        }}>

            {controlsExpanded &&
                <Collapse in={controlsExpanded} syle={{height:'auto'}}>
                    <SystemMessage overridePageId={pageId} placeholder={placeholderMessage}/>
                    <TextField
                        select
                        style={{width: 280, marginBottom:10}}
                        id='pageId'
                        label='Page'
                        value={pageId}
                        size='small'
                        margin='dense'
                        color='info'
                        onChange={e => {
                            setPageId(e.target.value)
                        }}
                    >
                        {allPages.map((page, index) =>
                            <MenuItem value={page} key={index}>{page}</MenuItem>
                        )}
                    </TextField>

                </Collapse>
            }

            <div style={{
                width: 760,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <div style={{width: '100%', textAlign: 'center'}}>
                    {!controlsExpanded &&
                        <Button variant='outlined' color='info' size='small'
                                style={{lineHeight: '1rem'}}
                                onClick={() => handleToggleControls()}>
                            Preview
                        </Button>
                    }
                    {controlsExpanded &&
                        <Button variant='outlined' color='info' size='small'
                                style={{lineHeight: '1rem'}}
                                onClick={() => handleToggleControls()}>
                            Close Preview
                        </Button>
                    }
                </div>

            </div>
        </div>
    )
}