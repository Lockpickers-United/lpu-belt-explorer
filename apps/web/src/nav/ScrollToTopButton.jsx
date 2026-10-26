import React, {useCallback} from 'react'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

function ScrollToTopButton() {
    const scrollToTop = useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
        const scrollable = document.getElementById('scrollable')
        if (scrollable) {
            scrollable.scrollTo({top: 0, behavior: 'smooth'})
        }
    }, [])

    return (
        <Tooltip title='Scroll to Top' arrow disableFocusListener>
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
        </Tooltip>
    )
}

export default ScrollToTopButton
