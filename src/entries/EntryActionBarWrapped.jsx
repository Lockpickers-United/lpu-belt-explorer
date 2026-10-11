import EntryActionBar from './EntryActionBar.jsx'
import React from 'react'
import {ClassificationProvider} from '../app/ClassificationContext.jsx'

export default function EntryActionBarWrapped({entry, openAdminForm}) {

    return (
        <ClassificationProvider>
            <EntryActionBar entry={entry} openAdminForm={openAdminForm}/>
        </ClassificationProvider>
    )

}