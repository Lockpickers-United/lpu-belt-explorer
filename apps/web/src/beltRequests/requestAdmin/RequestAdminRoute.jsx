import React from 'react'
import {beltRequestFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'
import LoadingDisplayNav from '../../nav/LoadingDisplayNav.jsx'
import ErrorMessage from '../../misc/ErrorMessage.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import RequestAdmin from './RequestAdmin.jsx'
import {RequestAdminDataProvider} from './RequestAdminDataProvider.jsx'
import requestSamples from './requestSamples.json'

export default function RequestAdminRoute() {
    const beltRequestsLoading = false
    const beltRequestsError = false

    if (beltRequestsLoading) return (
        <LoadingDisplayNav>
            <LoadingDisplay message={'Loading classification data'} style={{marginTop: 70}}/>
        </LoadingDisplayNav>
    )
    if (beltRequestsError) return (
        <LoadingDisplayNav>
            <ErrorMessage errorMessage={`Could not load classification changes: ${beltRequestsError.message}`}/>
        </LoadingDisplayNav>
    )

    return (
        <FilterProvider filterFields={beltRequestFilterFields}>
            <RequestAdminDataProvider allEntries={requestSamples}>
                <RequestAdmin/>
            </RequestAdminDataProvider>
        </FilterProvider>
    )
}
