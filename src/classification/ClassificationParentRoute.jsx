import React from 'react'
import {classificationFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import {ClassificationUIProvider} from './ClassificationUIProvider.jsx'

import allEntries from '../data/data.json'
import {Outlet} from 'react-router-dom'

export default function ClassificationParentRoute() {
    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationProvider>
                <ClassificationDataProvider allEntries={allEntries}>
                    <ClassificationUIProvider>
                        <Outlet/>
                    </ClassificationUIProvider>
                </ClassificationDataProvider>
            </ClassificationProvider>
        </FilterProvider>
    )
}
