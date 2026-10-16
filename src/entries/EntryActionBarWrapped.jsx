import EntryActionBar from './EntryActionBar.jsx'
import React from 'react'

export default function EntryActionBarWrapped({entry, openAdminForm, style, entryRef}) {

    return <EntryActionBar entry={entry} openAdminForm={openAdminForm} style={style} entryRef={entryRef}/>

}
