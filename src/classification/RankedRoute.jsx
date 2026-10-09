import React from 'react'
import RankedMain from './RankedMain'
import {ClassificationDataProvider} from './ClassificationDataProvider'
import {useOutletContext} from 'react-router-dom'

export default function RankedRoute() {

    const {allEntries} = useOutletContext()

    return (
        <ClassificationDataProvider allEntries={allEntries} route='ranked'>
            <RankedMain/>
        </ClassificationDataProvider>
    )
}
