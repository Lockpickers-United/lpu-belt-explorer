import React from 'react'
import ClassificationMain from './ClassificationMain'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import {useOutletContext} from 'react-router-dom'

export default function ClassificationRoute() {

    const {allEntries} = useOutletContext()

    return (
        <ClassificationDataProvider allEntries={allEntries}>
            <ClassificationMain/>
        </ClassificationDataProvider>
    )
}
