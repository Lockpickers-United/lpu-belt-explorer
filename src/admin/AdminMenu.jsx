import React from 'react'
import AdminMenuItem from './AdminMenuItem.jsx'
import menuConfig from './adminMenuConfig'
import {ToggleButtonGroup} from '@mui/material'

function AdminMenu() {
    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>

                <ToggleButtonGroup variant='outlined'>
                    {menuConfig
                        .map((menuItem, index) =>
                            <AdminMenuItem
                                key={index}
                                menuItem={menuItem}
                            />
                        )}
                </ToggleButtonGroup>
            </div>
        </React.Fragment>
    )
}

export default AdminMenu
