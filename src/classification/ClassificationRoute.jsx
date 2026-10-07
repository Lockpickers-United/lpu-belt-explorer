import React from 'react'
import {classificationFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import ClassificationMain from './ClassificationMain'
import allEntries from '../data/data.json'

export default function ClassificationRoute() {
    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationProvider>
                <ClassificationDataProvider allEntries={allEntries}>
                    <ClassificationMain/>
                </ClassificationDataProvider>
            </ClassificationProvider>
        </FilterProvider>
    )
}
