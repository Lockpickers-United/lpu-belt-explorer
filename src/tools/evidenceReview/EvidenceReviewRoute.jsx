import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import EvidenceReviewPage from './EvidenceReviewPage.jsx'
import useData from '../../util/useData.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'

function EvidenceReviewRoute() {
    usePageTitle('All Projects')

    const {data, loading, error} = useData({url})

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='All Projects' extras={nav}/>

            {(loading || error) &&
                <LoadingDisplay/>
            }

            {!loading && data &&
                <EvidenceReviewPage data={data} updated={data?.metadata?.updatedDateTime}/>
            }

            <Footer/>
        </React.Fragment>
    )
}

export default EvidenceReviewRoute

const url = 'https://explore.lpubelts.com/data/allProjects.json'
