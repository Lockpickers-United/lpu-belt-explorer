import React from 'react'
import Footer from '../nav/Footer.jsx'
import {Outlet} from 'react-router-dom'

function RankingRequestsParentRoute() {

    return (
        <React.Fragment>
            <Outlet/>
            <Footer/>
        </React.Fragment>
    )
}

export default RankingRequestsParentRoute
