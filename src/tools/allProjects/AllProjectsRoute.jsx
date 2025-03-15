import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import AllProjectsPage from './AllProjectsPage.jsx'
import useData from '../../util/useData.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'

function AllProjectsRoute() {
    usePageTitle('All Projects')

    const {data, loading, error} = useData({url})
    const projects = data
        ? data?.evidence
        : []

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='All Projects' extras={nav}/>

            {(loading || error) &&
                <LoadingDisplay/>
            }

            {!loading && projects.length > 0 &&
                <AllProjectsPage projects={projects} updated={data?.metadata?.updatedDateTime}/>
            }

            <Footer/>
        </React.Fragment>
    )
}

export default AllProjectsRoute

const url = 'https://explore.lpubelts.com/data/allProjects.json'
