import React from 'react'
import {beltRequestFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'
import RequestAdmin from './RequestAdmin.jsx'
import {RequestAdminDataProvider} from './RequestAdminDataProvider.jsx'

export default function RequestAdminRoute() {
    return (
        <FilterProvider filterFields={beltRequestFilterFields}>
            <RequestAdminDataProvider>
                <RequestAdmin/>
            </RequestAdminDataProvider>
        </FilterProvider>
    )
}
