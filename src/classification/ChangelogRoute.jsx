import React from 'react'
import ChangelogMain from './ChangelogMain'
import {ClassificationDataProvider} from './ClassificationDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'
import {classificationFilterFields} from '../data/filterFields.js'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function ChangelogRoute() {

    const {allEntries} = useOutletContext()

    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationDataProvider allEntries={allEntries}>
                <ChangelogMain/>
            </ClassificationDataProvider>
        </FilterProvider>
    )
}
