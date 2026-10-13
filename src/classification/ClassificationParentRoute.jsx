import React from 'react'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import allEntries from '../data/data.json'
import {Outlet} from 'react-router-dom'
import AccessControl from '../misc/AccessControl.jsx'

export default function ClassificationParentRoute() {
    const allowedRoles = ['admin', 'classificationAdmin', 'lpuMod', 'classificationTeam']

    const notAuthorizedContent = (
        <div>
            <div style={{fontWeight: 700}}>Not authorized.</div>
            We're sorry, you are not authorized to access this page.
            If you think this is an error, please reach out in <nobr>#lock-classification.</nobr><br/>
        </div>
    )

    return (
        <ClassificationProvider>
            <AccessControl requiredRoles={[]} allowedRoles={allowedRoles} signInRequired={true}
                           dialogContent={notAuthorizedContent} continueTo='/locks'>

                <Outlet context={{allEntries}}/>

            </AccessControl>
        </ClassificationProvider>
    )
}
