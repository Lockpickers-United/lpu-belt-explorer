import React, {useCallback, useContext, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import StarIcon from '@mui/icons-material/Star'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import LoadingDisplaySmall from '../misc/LoadingDisplaySmall.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

function WatchlistButton({id}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {lockCollection, addToLockCollection, removeFromLockCollection} = useContext(DBContext)
    const [checkboxUpdating, setCheckboxUpdating] = useState(null)

    const key = 'raffleWatchlist'
    const isChecked = useCallback(() => !!lockCollection[key] && !!lockCollection[key].includes(id), [id, lockCollection])
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

    const {isMobile} = useWindowSize()
    const style = !isMobile ? {marginTop:-4, marginRight:15, width: 36, minWidth: 36, height: 36} : {marginTop:-4, marginRight:8, width: 30, minWidth: 30, height: 30}

    return (
        <React.Fragment>
            {isLoggedIn &&
                <div style={{display: 'flex'}}>
                    <React.Fragment key={key}>
                        {checkboxUpdating === key
                            ? <div style={{marginLeft:-48}}><LoadingDisplaySmall/></div>
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
        </React.Fragment>
    )
}

export default WatchlistButton
