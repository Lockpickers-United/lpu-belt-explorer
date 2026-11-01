import React from 'react'
import {beltRequestFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'
import RequestAdmin from './RequestAdmin.jsx'
import {RequestAdminDataProvider} from './RequestAdminDataProvider.jsx'
import requestSamples from './requestSamples.json'
import {BeltAdminDBProvider} from './RequestAdminDBContext.jsx'

export default function RequestAdminRoute() {
    return (
        <FilterProvider filterFields={beltRequestFilterFields}>
            <BeltAdminDBProvider>
                <RequestAdminDataProvider allEntries={requestSamples}>
                    <RequestAdmin/>
                </RequestAdminDataProvider>
            </BeltAdminDBProvider>
        </FilterProvider>
    )
}
