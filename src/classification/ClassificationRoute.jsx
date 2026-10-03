import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {classificationFilterFields} from '../data/filterFields'
import {DataProvider} from './ClassificationDataProvider.jsx'
import {FilterProvider} from '../context/FilterContext'
import ClassificationMain from './ClassificationMain'

export default function ClassificationRoute() {
    const {lockCollection} = useContext(DBContext)

    return (
        <FilterProvider filterFields={classificationFilterFields}>
            <DataProvider profile={lockCollection}>
                <ClassificationMain />
            </DataProvider>
        </FilterProvider>
    )
}
