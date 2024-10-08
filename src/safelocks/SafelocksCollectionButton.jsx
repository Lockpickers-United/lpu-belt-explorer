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
import LoadingDisplay from '../misc/LoadingDisplay'

function SafelockCollectionButton({id, dense}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const [checkboxUpdating, setCheckboxUpdating] = useState(false)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {isMobile} = useWindowSize()

    const collected = collectionOptions.safelocks.getCollected(lockCollection)?.includes(id)
    const isChecked = useCallback(key => !!lockCollection[key] && !!lockCollection[key].includes(id), [id, lockCollection])

    const handleChange = useCallback(key => async (event, checked) => {
        event.preventDefault()
        setCheckboxUpdating(true)
        if (checked) {
            await addToLockCollection(key, id)
        } else {
            await removeFromLockCollection(key, id)
        }
        setCheckboxUpdating(false)
    }, [id, addToLockCollection, removeFromLockCollection])

    return (
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
                <Card>
                    <CardHeader
                        title='My Collection'
                        style={{color: isLoggedIn ? null : 'rgba(255, 255, 255, 0.5)'}}
                        onClick={handleClose}
                    />
                    <CardContent style={{paddingTop: 0}}>
                        {checkboxUpdating ?
                            <LoadingDisplay/>
                            :
                            <FormGroup>
                            {collectionOptions.safelocks.map.filter(c => c.entry === 'checkbox').map(({key, label}) =>
                                <FormControlLabel
                                    key={key}
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
                            )}
                        </FormGroup>
                        }
                    </CardContent>
                    <div style={{marginTop: -8, marginBottom: 16}}>
                        <SignInButton onClick={handleClose}/>
                    </div>
                </Card>
            </Popover>
        </React.Fragment>
    )
}

export default SafelockCollectionButton
