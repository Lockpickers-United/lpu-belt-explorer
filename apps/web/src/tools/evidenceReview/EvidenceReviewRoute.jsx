import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import EvidenceReviewPage from './EvidenceReviewPage.jsx'
import useData from '../../util/useData.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import {allProjects} from '../../data/dataUrls.js'

function EvidenceReviewRoute() {
    usePageTitle('All Projects')

    const {data, loading, error} = useData({url: allProjects})

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

