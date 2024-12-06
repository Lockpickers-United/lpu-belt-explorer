import React, {useContext} from 'react'
import {Outlet} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

function ToolsParentRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)

    return (
        <React.Fragment>

            {!authLoaded &&
                <React.Fragment>
                    <LoadingDisplay/>
                </React.Fragment>
            }

            {authLoaded && adminRole && <Outlet/>}

        </React.Fragment>
    )
}

export default ToolsParentRoute
