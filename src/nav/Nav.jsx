import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import VersionChecker from '../app/VersionChecker'
import MainMenu from './MainMenu'
import ScrollToTopButton from './ScrollToTopButton'
import UserMenu from './UserMenu'
import SystemMessage from '../systemMessage/SystemMessage.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

function Nav({extras, extrasTwo, title}) {

    const {isMobile} = useWindowSize()
    const spacer = isMobile && extrasTwo ? 20 : 0
    const flexStyle = !isMobile ? 'flex' : 'block'

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar style={{marginTop: 6, minHeight: 40}}>
                    <div style={{display: flexStyle, width: '100%'}}>
                        <div style={{display: 'flex', flexGrow: 1, marginBottom:8}}>
                            <MainMenu/>
                            <VersionChecker/>
                            <div style={{
                                flexGrow: 1,
                                fontWeight: 500,
                                fontSize: '1.5rem',
                                paddingLeft: 8,
                                paddingRight: 16,
                                marginTop: 6
                            }}>
                                <nobr>{title}</nobr>
                            </div>
                            {extras}

                            {!isMobile && extrasTwo &&
                                extrasTwo
                            }

                            <UserMenu/>
                        </div>
                        {isMobile && extrasTwo &&
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                {extrasTwo}
                            </div>
                        }
                    </div>
                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly below this */}
            <Toolbar style={{backgroundColor: 'rgba(255, 255, 255, 0.09)', marginTop: spacer}}/>

            <SystemMessage/>

            <ScrollToTopButton/>
        </React.Fragment>
    )
}

export default Nav
