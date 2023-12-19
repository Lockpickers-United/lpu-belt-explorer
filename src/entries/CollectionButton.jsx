import React, {useCallback, useContext, useMemo, useState} from 'react'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Popover from '@mui/material/Popover'
import SignInButton from '../auth/SignInButton'
import Tooltip from '@mui/material/Tooltip'
import useWindowSize from '../util/useWindowSize'
import {collectionOptions} from '../data/collectionTypes'

function CollectionButton({id, useIcon=false}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {width} = useWindowSize()
    const isMobile = width <= 500

    const isCollected = useMemo(() => {
        return Object.keys(lockCollection)
            .reduce((acc, key) => acc || lockCollection[key].includes(id), false)
    }, [id, lockCollection])

    const isChecked = useCallback(key => {
        return !!lockCollection[key] && !!lockCollection[key].includes(id)
    }, [id, lockCollection])

    const handleChange = useCallback(key => (event, checked) => {
        event.preventDefault()

        if (checked) {
            addToLockCollection(key, id)
        } else {
            removeFromLockCollection(key, id)
        }
    }, [id, addToLockCollection, removeFromLockCollection])

    return (
        <React.Fragment>
            { useIcon &&
                <Tooltip title='My Collection' arrow disableFocusListener>
                    <IconButton onClick={handleOpen}>
                        <LibraryBooksIcon color={isCollected ? 'secondary' : 'inherit'}
                                          fontSize='small'
                        />
                    </IconButton>
                </Tooltip>
            }
            { !useIcon &&
                <Tooltip title='My Collection' arrow disableFocusListener>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={handleOpen}
                        size={isMobile ? 'small' : 'medium'}
                        startIcon={
                            <LibraryBooksIcon color={isCollected ? 'secondary' : 'inherit'}/>
                        }>
                        My Collection
                    </Button>
                </Tooltip>
            }
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
                    <CardHeader  onClick={handleClose}
                        title='My Collection'
                        style={{color: isLoggedIn ? null : 'rgba(255, 255, 255, 0.5)'}}
                    />
                    <CardContent style={{paddingTop: 0}}>
                        <FormGroup>
                            {collectionOptions.map(({key, label}) =>
                                <React.Fragment key={key}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disabled={!isLoggedIn}
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

                    <div style={{marginTop: -8, marginBottom: 16}}>
                        <SignInButton onClick={handleClose}/>
                    </div>
                </Card>
            </Popover>
        </React.Fragment>
    )
}

export default CollectionButton
