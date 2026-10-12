import React from 'react'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import allEntries from '../data/data.json'

import {Outlet} from 'react-router-dom'

export default function ClassificationParentRoute() {
    return (
            <ClassificationProvider>
                <Outlet context={{allEntries}}/>
            </ClassificationProvider>
    )
}
