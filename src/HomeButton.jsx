import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import FilterContext from './FilterContext.jsx'
import LPUImage from './resources/LPU.png'

function HomeButton({onChangeTab}) {
    const {clearFilters} = useContext(FilterContext)
    const handleClick = useCallback(() => {
        onChangeTab('white')
        setTimeout(() => clearFilters(true), 50)
    }, [clearFilters, onChangeTab])

    return (
        <IconButton edge='start' color='inherit' size='medium' sx={{mr: 1}} onClick={handleClick}>
            <img alt='LPU' src={LPUImage} width={36} height={36}/>
        </IconButton>
    )
}

export default HomeButton
