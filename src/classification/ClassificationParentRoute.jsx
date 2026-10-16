import React, {useContext} from 'react'
import allEntries from '../data/data.json'
import {Outlet, useLocation} from 'react-router-dom'
import AccessControl from '../misc/AccessControl.jsx'
import ClassificationContext, {ClassificationSummaryProvider} from '../app/ClassificationContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import LoadingDisplayNav from '../nav/LoadingDisplayNav.jsx'
import ErrorMessage from '../misc/ErrorMessage.jsx'

const notAuthorizedContent = (
    <div>
        <div style={{fontWeight: 700}}>Not authorized.</div>
        We're sorry, you are not authorized to access this page.
        If you think this is an error, please reach out in <nobr>#lock-classification.</nobr><br/>
    </div>
)

export default function ClassificationParentRoute() {
    const {pathname} = useLocation()

    if (pathname === '/classification/past') return <ClassificationParentContent/>

    return <ClassificationSummaryProvider><ClassificationParentContent/></ClassificationSummaryProvider>
}

function ClassificationParentContent() {
    const allowedRoles = ['admin', 'classificationAdmin', 'lpuMod', 'classificationTeam']
    const {mayRead, summaryLoading, summaryError, ownerLoading, ownerError} = useContext(ClassificationContext)

    if (mayRead && (summaryError || ownerError)) return (
        <LoadingDisplayNav>
            <ErrorMessage errorMessage={'There was an error loading the classification data.'}/>
        </LoadingDisplayNav>
    )
    if (mayRead && (summaryLoading || ownerLoading)) return (
        <LoadingDisplayNav>
            <LoadingDisplay message={'Loading classification data'} style={{marginTop: 70}}/>
        </LoadingDisplayNav>
    )

    return (
        <AccessControl requiredRoles={[]}
                       allowedRoles={allowedRoles}
                       denyAccess={!mayRead}
                       signInRequired={true}
                       dialogContent={notAuthorizedContent}
                       continueTo='/locks'>

            <Outlet context={{allEntries}}/>

        </AccessControl>
    )
}
