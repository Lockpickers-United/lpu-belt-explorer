import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import VersionChecker from '../app/VersionChecker'
import MainMenu from './MainMenu'
import ScrollToTopButton from './ScrollToTopButton'
import UserMenu from './UserMenu'
import SystemMessage from '../systemMessage/SystemMessage.jsx'

function Nav({extras, title}) {
    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <MainMenu/>

                    <VersionChecker/>

                    <div style={{
                        flexGrow: 1,
                        fontWeight: 500,
                        fontSize: '1.5rem',
                        paddingLeft: 16
                    }}><nobr>{title}</nobr></div>

                    {extras}

                    <UserMenu/>
                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly below this */}
            <Toolbar style={{backgroundColor: 'rgba(255, 255, 255, 0.09)'}}/>

            <SystemMessage/>

            <ScrollToTopButton/>
        </React.Fragment>
    )
}

export default Nav
