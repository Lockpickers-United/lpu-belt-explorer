import React from 'react'
import Footer from '../nav/Footer.jsx'
import {Outlet} from 'react-router-dom'

export default function LockyJrParentRoute() {

    return (
        <React.Fragment>
            <Outlet/>
            <Footer/>
        </React.Fragment>
    )
}

