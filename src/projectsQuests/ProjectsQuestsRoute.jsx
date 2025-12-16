import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {projectFilterFields} from '../data/filterFields'
import usePageTitle from '../util/usePageTitle'
import {DataProvider} from './ProjectsDataProvider'
import {FilterProvider} from '../context/FilterContext'
import ProjectsQuests from './ProjectsQuests.jsx'

export default function ProjectsQuestsRoute() {
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Projects & Quests')

    return (
        <FilterProvider filterFields={projectFilterFields}>
            <DataProvider profile={lockCollection}>
                    <ProjectsQuests/>
            </DataProvider>
        </FilterProvider>
    )
}