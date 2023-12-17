import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import VersionChecker from '../app/VersionChecker'
import HomeButton from './HomeButton'
import Tracker from '../app/Tracker'
import ScrollToTopButton from './ScrollToTopButton'
import MainMenu from "./MainMenu.jsx";
import UserMenu from "./UserMenu.jsx";

function NavGeneric({extras}) {
    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <Tracker/>

                    <HomeButton/>

                    <div style={{flexGrow: 1, backgroundColor:'#f00'}}></div>

                    <VersionChecker/>

                    {extras}

                    <UserMenu style={{marginRight:200}}/>
                    <MainMenu/>

                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly below this */}
            <Toolbar style={{backgroundColor: 'rgba(255, 255, 255, 0.09)'}}/>

            <ScrollToTopButton/>
        </React.Fragment>
    )
}

export default NavGeneric
