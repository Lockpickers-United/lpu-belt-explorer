import React, {useContext, useDeferredValue, useMemo, useState} from 'react'
import Entry from './Entry'
import EntryCompact from './EntryCompact'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import BeltRequirements from '../info/BeltRequirements'
import DataContext from '../contexts/DataContext'
import AppContext from '../contexts/AppContext'
import NoEntriesCard from './NoEntriesCard'
import InlineHeaderDisplay from './InlineHeaderDisplay'
import InlineDisplaySpacer from './InlineDisplaySpacer.jsx'
import FilterContext from '../contexts/FilterContext'
import DBContext from "../contexts/DBContext.jsx"
import EntryList from './EntryList.jsx'
import List from "@mui/material/List";
import InlineCollectionSelect from './InlineCollectionSelect.jsx'
import queryString from "query-string";
import mglog from './mglog.js'

function EntriesList() {

    const {filters} = useContext(FilterContext)
    const {filterCount} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)
    const {collection} = queryString.parse(location.search)

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }
    mglog(currentCollection)

    const {allEntries, visibleEntries = []} = useContext(DataContext)
    const {tab, expanded, setExpanded, displayAll} = useContext(AppContext)

    const defTab = useDeferredValue(tab)
    const defExpanded = useDeferredValue(expanded)
    const defDisplayAll = useDeferredValue(displayAll)

    const entries = useMemo(() => {
        if (defTab === 'search') {
            return defDisplayAll || allEntries.length !== visibleEntries.length
                ? visibleEntries
                : []
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === defTab)
        }
    }, [defDisplayAll, defTab, allEntries, visibleEntries])

    function EntryObject(entry, index) {
        if (compactDisplay && currentCollection) {
            return <EntryCompact
                key={entry.id}
                entry={entry}
                expanded={entry.id === defExpanded}
                onExpand={setExpanded}
            />
        } else if (listDisplay && currentCollection) {
            return (
                <EntryList key={entry.id} entry={entry} index={index}/>
            )
        } else {
            return <Entry
                key={entry.id}
                entry={entry}
                expanded={entry.id === defExpanded}
                onExpand={setExpanded}
            />
        }
    }

    const style = {
        maxWidth: 700, marginLeft:
            'auto', marginRight:
            'auto', marginTop:
            0
    }

    const alwaysDisplay = true
    const listDisplay = true
    const compactDisplay = false


    if (listDisplay && currentCollection || alwaysDisplay) {
        return (
            <React.Fragment>
                <div style={{margin: '8px 8px 0px 8px'}}>

                    <InlineDisplaySpacer/>
                    <InlineHeaderDisplay/>
                    <InlineFilterDisplay/>

                    {defTab !== 'search' && <BeltRequirements belt={defTab}/>}
                    {entries.length === 0 && <NoEntriesCard/>}
                </div>

                <div style={{
                    maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                    marginLeft: 'auto', marginRight: 'auto'
                }}>
                    <InlineCollectionSelect sx={{}}/>
                    <List style={style} dense sx={{padding: "8px 0px 8px 0px", backgroundColor: '#000'}}>
                        {entries.map((entry, index) =>
                            <EntryList key={entry.id} entry={entry} index={index}/>
                        )}
                    </List>
                </div>
                <div style={{margin: 8, marginBottom: 24}}/>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <div style={{margin: 8, paddingBottom: 32}}>
                    <InlineDisplaySpacer/>
                    <InlineHeaderDisplay/>
                    <InlineFilterDisplay/>

                    {defTab !== 'search' && <BeltRequirements belt={defTab}/>}
                    {entries.length === 0 && <NoEntriesCard/>}
                    {entries.map(entry =>
                        <Entry
                            key={entry.id}
                            entry={entry}
                            expanded={entry.id === defExpanded}
                            onExpand={setExpanded}
                        />
                    )}
                </div>
            </React.Fragment>
       )
    }
}

export default EntriesList
