import React, {useCallback, useContext} from 'react'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import LockIcon from '@mui/icons-material/Lock'
import WorkIcon from '@mui/icons-material/Work'
import IconButton from '@mui/material/IconButton'
import FilterContext from '../context/FilterContext.jsx'
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ConstructionIcon from '@mui/icons-material/Construction'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'

export default function EntryTypeIcon({entry}) {
    const {addFilter} = useContext(FilterContext)
    const entryType = entry.category?.[0]

    const handleClick = useCallback((event) => {
        event.stopPropagation()
        addFilter('category', entry.category?.[0], true)
        setTimeout(() => {
            document.getElementById('raffleSearchBar')?.scrollIntoView({
                behavior: 'smooth', block: 'start'
            })
        }, 100)

    }, [addFilter, entry.category])

    const icons = {
        'Cases': <WorkIcon fontSize='small' style={{color: '#eee'}}/>,
        'Gift certificates': <LocalAtmIcon fontSize='small' style={{color: '#eee'}}/>,
        'Locks': <LockIcon fontSize='small' style={{color: '#eee'}}/>,
        'Picks': <RestaurantMenuIcon fontSize='small' style={{color: '#eee'}}/>,
        'Swag': <ShoppingBasketIcon fontSize='small' style={{color: '#eee'}}/>,
        'Tools': <ConstructionIcon fontSize='small' style={{color: '#eee'}}/>
    }

    return (
        <>
            {entryType
                ? <IconButton size='small' onClick={e => handleClick(e)}>
                    {icons[entryType] || <HelpCenterOutlinedIcon style={{color: '#ccc'}}/>}
                </IconButton>
                : null
            }
        </>
    )
}