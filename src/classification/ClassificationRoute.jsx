import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {classificationFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import ClassificationMain from './ClassificationMain'
import allEntries from '../data/data.json'

export default function ClassificationRoute() {
    const {profile} = useContext(DBContext)

    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <ClassificationProvider>
                <ClassificationDataProvider allEntries={allEntries} profile={profile}>
                    <ClassificationMain/>
                </ClassificationDataProvider>
            </ClassificationProvider>
        </FilterProvider>
    )
}
