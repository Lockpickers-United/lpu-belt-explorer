import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import FilterContext from './FilterContext.jsx'

function HomeButton({onChangeTab}) {
    const {clearFilters} = useContext(FilterContext)
    const handleClick = useCallback(() => {
        clearFilters(true)
        onChangeTab('white')
    }, [clearFilters, onChangeTab])

    return (
        <IconButton edge='start' color='inherit' size='medium' sx={{mr: 1}} onClick={handleClick}>
            <img alt='LPU' src='https://images.lpubelts.com/i/LPU-f691d3fe.png' width={36} height={36}/>
        </IconButton>
    )
}

export default HomeButton
