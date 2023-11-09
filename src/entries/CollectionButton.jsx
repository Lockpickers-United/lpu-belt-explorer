import React, {useCallback, useContext, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CollectionsIcon from '@mui/icons-material/Collections'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import AppContext from '../contexts/AppContext'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import {collectionOptions} from '../data/collectionTypes'

function CollectionButton({id}) {
    const {beta} = useContext(AppContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const isChecked = useCallback(key => {
        return !!lockCollection[key] && !!lockCollection[key].includes(id)
    }, [id, lockCollection])

    const handleChange = useCallback(key => (event, checked) => {
        if (checked) {
            addToLockCollection(key, id)
        } else {
            removeFromLockCollection(key, id)
        }
    }, [id, addToLockCollection, removeFromLockCollection])

    if (!beta || !isLoggedIn) return null
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
                            {collectionOptions.map(({key, label}) =>
                                <React.Fragment key={key}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color='secondary'
                                                checked={isChecked(key)}
                                                onChange={handleChange(key)}
                                            />
                                        }
                                        label={label}
                                    />
                                </React.Fragment>
                            )}
                        </FormGroup>
                    </CardContent>
                </Card>
            </Popover>
        </React.Fragment>
    )
}

export default CollectionButton
