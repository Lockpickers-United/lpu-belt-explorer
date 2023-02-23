import React, {useCallback} from 'react'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop.js'
import {Fab} from '@mui/material'

function ScrollToTopButton() {
    const scrollToTop = useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    return (
        <Fab
            size='small'
            sx={{
                position: 'fixed',
                right: 16,
                bottom: 16,
                zIndex: 1000
            }}
            onClick={scrollToTop}
        >
            <VerticalAlignTopIcon/>
        </Fab>
    )
}

export default ScrollToTopButton
