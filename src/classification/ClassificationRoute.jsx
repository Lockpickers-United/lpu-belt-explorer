import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {lockFilterFields} from '../data/filterFields'
import {DataProvider} from './ClassificationDataProvider.jsx'
import {FilterProvider} from '../context/FilterContext'
import sampleData from '../data/classification-samples.json'
import ClassificationMain from './ClassificationMain'

export default function ClassificationRoute({allEntries = sampleData}) {
    const {lockCollection} = useContext(DBContext)

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                    <ClassificationMain/>
            </DataProvider>
        </FilterProvider>
    )
}
