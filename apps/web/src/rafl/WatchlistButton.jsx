import React, {useCallback, useContext, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import StarIcon from '@mui/icons-material/Star'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import LoadingDisplaySmall from '../misc/LoadingDisplaySmall.jsx'
import Popover from '@mui/material/Popover'
import SignInButton from '../auth/SignInButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

function WatchlistButton({id}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(() => undefined)
    const open = Boolean(anchorEl)

    const {isMobile} = useWindowSize()
    const [checkboxUpdating, setCheckboxUpdating] = useState(null)

    const key = 'raffleWatchlist'
    const isChecked = useCallback(() => !!lockCollection[key] && lockCollection[key].includes(id), [id, lockCollection])
    const tooltipText = isChecked() ? 'Remove from Watchlist' : 'Add to Watchlist'

    const handleChange = useCallback((key, collected) => async (event, checked) => {
        event.preventDefault()
        event.stopPropagation()
        setCheckboxUpdating(key)
        if (checked || !collected) {
            await addToLockCollection(key, id)
        } else {
            await removeFromLockCollection(key, id)
        }
        setCheckboxUpdating(null)
    }, [id, addToLockCollection, removeFromLockCollection])
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(null)
    }, [])

    const diameter = 36
    const watchlistButtonSpacing = isMobile ? 4 : 8
    const style =  {marginTop: -2, marginRight: watchlistButtonSpacing, width: diameter, minWidth: diameter, height: diameter}

    return (
        <div style={style}>
            {isLoggedIn &&
                <div style={{display: 'flex', justifyItems: 'left'}}>
                    <React.Fragment key={key}>
                        {checkboxUpdating === key
                            ? <div style={{marginTop: 1}}><LoadingDisplaySmall/></div>
                            : <Tooltip title={tooltipText} arrow disableFocusListener>
                                <IconButton key={key} onClick={handleChange(key, isChecked())}
                                            style={{
                                                color: isChecked() ? '#13e113' : '#999', ...style
                                            }}>
                                    <StarIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                    </React.Fragment>
                </div>
            }
            {!isLoggedIn &&
                <React.Fragment>
                    <Tooltip title={tooltipText} arrow disableFocusListener>
                        <IconButton key={key} onClick={handleOpen}
                                    style={{
                                        color: isChecked() ? '#13e113' : '#999', ...style
                                    }}>
                            <StarIcon/>
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
                        <div style={{display:'flex', padding: 30, width: 300, placeItems: 'center'}} onClick={handleClose}>
                            <div>
                                <strong>Log in to keep a RAFL Watchlist!</strong><br/><br/>
                                <SignInButton/>
                            </div>
                        </div>
                    </Popover>
                </React.Fragment>
            }

        </div>
    )
}

export default WatchlistButton
