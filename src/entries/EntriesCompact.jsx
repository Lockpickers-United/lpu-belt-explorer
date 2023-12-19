import React, {useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import BeltRequirements from '../info/BeltRequirements'
import DataContext from '../contexts/DataContext'
import AppContext from '../contexts/AppContext'
import NoEntriesCard from './NoEntriesCard'
import InlineHeaderDisplay from './InlineHeaderDisplay'
import InlineDisplaySpacer from './InlineDisplaySpacer.jsx'
import FilterContext from '../contexts/FilterContext'
import EntryList from './EntryCompact.jsx'
import List from '@mui/material/List'
import InlineCollectionSelect from './InlineCollectionSelect.jsx'

function EntriesCompact() {

    const {allEntries, visibleEntries = []} = useContext(DataContext)
    const {tab, expanded, setExpanded, displayAll} = useContext(AppContext)
    const {filters} = useContext(FilterContext)
    const {filterCount} = useContext(FilterContext)

    let currentCollection = ''
    if (filters && filters.collection) {
        currentCollection = (typeof filters.collection === 'string')
            ? filters.collection
            : filters.collection[0]
    }


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

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 0}

    const collectionFiltered = !!currentCollection?.match(/^(Own|Picked|Recorded|Wishlist)$/)
    const showInlineFilterDisplay = !(collectionFiltered && filterCount < 2)
    const showBeltRequirements = (defTab !== 'search' && !collectionFiltered && entries.length !== 0)

    return (
        <React.Fragment>
            <div style={{margin: '0px 8px 0px 8px'}}>
                {currentCollection && <div style={{marginTop: '8px'}}/>}
                <InlineDisplaySpacer/>
                <InlineHeaderDisplay/>
                {showInlineFilterDisplay && <InlineFilterDisplay/>}
            </div>

            <div style={{
                maxWidth: 700, marginLeft: 'auto', marginRight: 'auto',
                padding: '8px 8px 16px 8px', backgroundColor: '#000'
            }}>
                {showBeltRequirements && <div><BeltRequirements belt={defTab}/></div>}
                <InlineCollectionSelect sx={{}}/>
                {entries.length === 0 && <NoEntriesCard/>}
                <List style={style} dense sx={{padding: '8px 0px 8px 0px', backgroundColor: '#000'}}>
                    {entries.map((entry, index) =>
                        <EntryList key={entry.id} entry={entry} index={index}/>
                    )}
                </List>
            </div>
            <div style={{margin: 8, marginBottom: 24}}/>
        </React.Fragment>
    )
}

export default EntriesCompact
