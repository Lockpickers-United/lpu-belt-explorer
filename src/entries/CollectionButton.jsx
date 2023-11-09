import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React, {useCallback, useContext, useState} from 'react'
import AppContext from '../contexts/AppContext'
import CollectionsIcon from '@mui/icons-material/Collections'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

function CollectionButton() {
    const {beta} = useContext(AppContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    if (!beta) return null
    return (
        <React.Fragment>
            <Tooltip title='My Collection' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen}>
                    <CollectionsIcon/>
                </IconButton>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <Card>
                    <CardHeader title='My Collection'/>
                    <CardContent style={{paddingTop: 0}}>
                        <FormGroup>
                            {options.map(({key, label}) =>
                                <React.Fragment key={key}>
                                    <FormControlLabel control={<Checkbox/>} label={label} />
                                </React.Fragment>
                            )}
                        </FormGroup>
                    </CardContent>
                </Card>
            </Popover>
        </React.Fragment>
    )
}

const options = [
    {key: 'own', label: 'Own'},
    {key: 'wishlist', label: 'Wishlist'},
    {key: 'previouslyOwned', label: 'Previously Owned'},
    {key: 'picked', label: 'Picked'},
    {key: 'recorded', label: 'Recorded'}
]

export default CollectionButton
