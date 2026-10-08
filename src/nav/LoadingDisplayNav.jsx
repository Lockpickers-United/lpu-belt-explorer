import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import UserMenu from './UserMenu'
import useWindowSize from '../util/useWindowSize.jsx'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

export default function LoadingDisplayNav() {
    const {isMobile, width} = useWindowSize()
    const smallWidth = width <= 500
    const spacer = isMobile ? 6 : 0

    const flexStyle = !isMobile ? 'flex' : 'block'

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar style={{marginTop: 6, minHeight: 40}}>
                    <div style={{display: flexStyle, width: '100%'}}>
                        <div style={{display: 'flex', flexGrow: 1, marginBottom: 8}}>
                            <IconButton disabled={true}
                                        edge='start'
                                        color='inherit'
                                        style={{
                                            backgroundColor: '#181818',
                                            height: '36px',
                                            width: '36px',
                                            marginLeft: '-8px',
                                            marginTop: 6
                                        }}
                            >
                                <MenuIcon/>
                            </IconButton>

                            <div style={{
                                flexGrow: 1,
                                fontWeight: 500,
                                fontSize: '1.5rem',
                                paddingLeft: 8,
                                paddingRight: 16,
                                marginTop: 6
                            }} role='heading' aria-label='Loading'>
                                {(!smallWidth) &&
                                    <div style={{whiteSpace: 'nowrap'}}></div>
                                }
                            </div>
                            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
                            <UserMenu/>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly below this */
            }
            <Toolbar style={{backgroundColor: 'rgba(255, 255, 255, 0.09)', marginTop: spacer}}/>


        </React.Fragment>
    )
}