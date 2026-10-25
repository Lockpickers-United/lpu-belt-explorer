import React from 'react'
import ClassificationMain from './ClassificationMain'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import {useOutletContext} from 'react-router-dom'
import {classificationFilterFields} from '../data/filterFields.js'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function ClassificationRoute() {

    const {allEntries} = useOutletContext()

    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationDataProvider allEntries={allEntries}>
                <ClassificationMain/>
            </ClassificationDataProvider>
        </FilterProvider>
    )
}
