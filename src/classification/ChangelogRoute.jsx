import React, {useContext} from 'react'
import ChangelogMain from './ChangelogMain'
import {ClassificationDataProvider} from './ClassificationDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'
import {classificationFilterFields} from '../data/filterFields.js'
import {FilterProvider} from '../context/FilterContext.jsx'
import ClassificationChangelogProvider from './ClassificationChangelogProvider.jsx'
import LoadingDisplayNav from '../nav/LoadingDisplayNav.jsx'
import ErrorMessage from '../misc/ErrorMessage.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'

export default function ChangelogRoute() {
    const {allEntries} = useOutletContext()
    const {changelogLoading, changelogError} = useContext(ClassificationContext)

    if (changelogError) return (
        <LoadingDisplayNav>
            <ErrorMessage errorMessage={`Could not load classification changes: ${changelogError.message}`}/>
        </LoadingDisplayNav>
    )
    if (changelogLoading) return (
        <LoadingDisplayNav>
            <LoadingDisplay message={'Loading classification data'} style={{marginTop: 70}}/>
        </LoadingDisplayNav>
    )

    return (
        <ClassificationChangelogProvider>
            <FilterProvider filterFields={classificationFilterFields}>
                <ClassificationDataProvider allEntries={allEntries}>
                    <ChangelogMain/>
                </ClassificationDataProvider>
            </FilterProvider>
        </ClassificationChangelogProvider>
    )
}
