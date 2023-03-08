import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import FilterContext from '../contexts/FilterContext.jsx'
import LPUImage from '../resources/LPU.png'
import AppContext from '../contexts/AppContext.jsx'
import {Tooltip} from '@mui/material'

function HomeButton() {
    const {setTab} = useContext(AppContext)
    const {clearFilters} = useContext(FilterContext)
    const handleClick = useCallback(() => {
        setTab('White')
        window.scrollTo({top: 0, behavior: 'smooth'})

        setTimeout(() => clearFilters(true), 50)
    }, [clearFilters, setTab])

    return (
        <Tooltip title='Home' arrow disableFocusListener>
            <IconButton edge='start' color='inherit' size='medium' sx={{mr: 1}} onClick={handleClick}>
                <img alt='LPU' src={LPUImage} width={36} height={36}/>
            </IconButton>
        </Tooltip>
    )
}

export default HomeButton
