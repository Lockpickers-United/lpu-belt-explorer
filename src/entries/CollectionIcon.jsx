import React, {useCallback, useContext, useMemo, useState} from 'react'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import SignInButton from '../auth/SignInButton'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import {collectionOptions} from '../data/collectionTypes'
import useWindowSize from '../util/useWindowSize'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function CollectionIcon({id}) {
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
            <LibraryBooksIcon color={isCollected ? 'secondary' : 'inherit'} fontSize='small'/>
        </React.Fragment>
    )
}

export default CollectionIcon
