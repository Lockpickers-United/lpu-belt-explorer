import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import AllProjectsPage from './AllProjectsPage.jsx'

function AllProjectsRoute() {
    usePageTitle('All Projects')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='All Projects' extras={nav}/>

            <AllProjectsPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default AllProjectsRoute