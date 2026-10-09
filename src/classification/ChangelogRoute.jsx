import React from 'react'
import ChangelogMain from './ChangelogMain'
import {ClassificationDataProvider} from './ClassificationDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'

export default function ChangelogRoute() {

    const {allEntries} = useOutletContext()

    return (
        <ClassificationDataProvider allEntries={allEntries}>
            <ChangelogMain/>
        </ClassificationDataProvider>
    )
}
