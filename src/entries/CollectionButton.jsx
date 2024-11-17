import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import SignInButton from '../auth/SignInButton'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import collectionOptions from '../data/collectionTypes'
import useWindowSize from '../util/useWindowSize'
import RecordingControls from './RecordingControls'
import LoadingDisplay from '../misc/LoadingDisplay'
import LoadingDisplaySmall from '../misc/LoadingDisplaySmall'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

function CollectionButton({id, dense, exposed}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(() => undefined)
    const [checkboxUpdating, setCheckboxUpdating] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {isMobile} = useWindowSize()

    const collected = collectionOptions.locks.getCollected(lockCollection)?.includes(id)
    const isChecked = useCallback(key => !!lockCollection[key] && !!lockCollection[key].includes(id), [id, lockCollection])

    const handleChange = useCallback((key, collected) => async (event, checked) => {
        console.log('handleChange', collected)
        event.preventDefault()
        setCheckboxUpdating(key)
        if (checked || !collected) {
            await addToLockCollection(key, id)
        } else {
            await removeFromLockCollection(key, id)
        }
        setCheckboxUpdating(null)
    }, [id, addToLockCollection, removeFromLockCollection])

    const listIcons = {
        own: <LockIcon fontSize={isMobile ? 'small' : 'medium'}/>,
        picked: <LockOpenOutlinedIcon fontSize={isMobile ? 'small' : 'medium'}/>,
        wishlist: <SavingsOutlinedIcon fontSize={isMobile ? 'small' : 'medium'}/>,
        recordedLocks: <VideocamOutlinedIcon fontSize={isMobile ? 'small' : 'medium'}/>
    }

    const iconPadding = isMobile ? 5 : 7

    return (
        <React.Fragment>
            {exposed && isLoggedIn &&
                <div style={{display: 'flex'}}>
                    {collectionOptions.locks.map.filter(c => c.entry === 'checkbox').map(({key}) =>
                        <React.Fragment key={key}>
                            {checkboxUpdating === key
                                ? <LoadingDisplaySmall/>
                                : <IconButton key={key} onClick={handleChange(key, isChecked(key))}
                                              style={{color: isChecked(key) ? '#18aa18' : undefined, padding: iconPadding}}>
                                    {listIcons[key]}
                                </IconButton>
                            }
                        </React.Fragment>
                    )}
                    <RecordingControls lockId={id} dense/>
                </div>
            }
            {!exposed &&
                <React.Fragment>
                    <Tooltip title='My Collection' arrow disableFocusListener>
                        {
                            dense
                                ? <IconButton
                                    variant='outlined'
                                    color='inherit'
                                    onClick={handleOpen}
                                >
                                    <LibraryBooksIcon color={collected ? 'secondary' : 'inherit'} fontSize='small'/>
                                </IconButton>
                                : <Button
                                    variant='outlined'
                                    color='inherit'
                                    onClick={handleOpen}
                                    startIcon={
                                        <LibraryBooksIcon color={collected ? 'secondary' : 'inherit'}
                                                          fontSize={isMobile ? 'small' : 'medium'}/>
                                    }
                                >
                                    My Collection
                                </Button>
                        }
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
                        <Card style={{backgroundColor: '#222'}}>
                            <CardHeader
                                title='My Collection'
                                style={{color: isLoggedIn ? null : 'rgba(255, 255, 255, 0.5)'}}
                                onClick={handleClose}
                            />
                            <CardContent style={{paddingTop: 0}}>
                                {checkboxUpdating ?
                                    <LoadingDisplay/>
                                    :
                                    <React.Fragment>
                                        <FormGroup>
                                            {collectionOptions.locks.map.filter(c => c.entry === 'checkbox')
                                                .map(({key, label}) =>
                                                    <FormControlLabel
                                                        key={key}
                                                        control={
                                                            <Checkbox
                                                                id={key}
                                                                disabled={!isLoggedIn}
                                                                color='secondary'
                                                                checked={isChecked(key)}
                                                                onChange={handleChange(key, isChecked(key))}
                                                            />
                                                        }
                                                        label={label}
                                                    />
                                                )}
                                        </FormGroup>

                                        {isLoggedIn &&
                                            <RecordingControls lockId={id}/>
                                        }
                                    </React.Fragment>
                                }
                            </CardContent>
                            <div style={{marginTop: -8, marginBottom: 16}}>
                                <SignInButton onClick={handleClose}/>
                            </div>
                        </Card>
                    </Popover>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default CollectionButton
