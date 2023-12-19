import React, {useCallback, useContext, useMemo, useState} from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import {collectionOptions} from '../data/collectionTypes'
import useWindowSize from '../util/useWindowSize'
import Typography from "@mui/material/Typography";
import OpenLinkToEntryButton from "./OpenLinkToEntryButton.jsx";

function CollectionFormHoriz({id}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
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
        <FormGroup row>
            {collectionOptions.map(({key, label}) =>
                <React.Fragment key={key}>
                    <FormControlLabel
                        style={{marginRight: 14}}
                        control={
                            <Checkbox
                                disabled={!isLoggedIn}
                                color='secondary'
                                checked={isChecked(key)}
                                onChange={handleChange(key)}
                                size="small"
                                style={{padding: '3px 3px 3px 8px'}}
                            />
                        }
                        label={
                            <Typography style={{fontSize: '.93rem'}}>
                                {label}
                            </Typography>}
                    />
                </React.Fragment>
            )}
        </FormGroup>
    )
}

export default CollectionFormHoriz
