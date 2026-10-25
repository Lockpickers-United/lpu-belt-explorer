import React from 'react'
import RankedMain from './RankedMain'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import {useOutletContext} from 'react-router-dom'
import {classificationFilterFields} from '../data/filterFields.js'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function RankedRoute() {

    const {allEntries} = useOutletContext()

    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationDataProvider allEntries={allEntries}>
                <RankedMain/>
            </ClassificationDataProvider>
        </FilterProvider>
    )
}
