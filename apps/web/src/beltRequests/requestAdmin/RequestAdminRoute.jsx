import React from 'react'
import {beltRequestFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'
import RequestAdmin from './RequestAdmin.jsx'
import {RequestAdminDataProvider} from './RequestAdminDataProvider.jsx'
import {BeltAdminDBProvider} from './RequestAdminDBContext.jsx'

export default function RequestAdminRoute() {
    return (
        <FilterProvider filterFields={beltRequestFilterFields}>
            <BeltAdminDBProvider>
                <RequestAdminDataProvider>
                    <RequestAdmin/>
                </RequestAdminDataProvider>
            </BeltAdminDBProvider>
        </FilterProvider>
    )
}
