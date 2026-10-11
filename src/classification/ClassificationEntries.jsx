import React, {useState, useContext} from 'react'
import DataContext from '../context/DataContext.jsx'
import Entry from '../entries/Entry.jsx'
import NoEntriesCard from '../locks/NoEntriesCard'
import ExportButton from '../locks/ExportButton'
import Footer from '../nav/Footer'
import FilterContext from '../context/FilterContext.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'

export default function ClassificationEntries({advancedEnabled = false, historical = false}) {
    const {visibleEntries = [], expandAll} = useContext(DataContext)

    const {filters, isSearch} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries} advancedEnabled={advancedEnabled}/>
        </div>
    )

    const footer = null

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>

                <AdvancedFilters/>

                {visibleEntries.length === 0 && <NoEntriesCard label='Locks' isSearch={isSearch}/>}

                <div aria-label='Locks' role='list'>
                    {visibleEntries.map((entry) =>
                            <Entry
                                key={entry.id}
                                entry={entry}
                                expanded={entry.id === entryExpanded
                                    || !!expandAll
                                    || visibleEntries.length === 1}
                                onExpand={setEntryExpanded}
                                isHistorical={historical}
                            />
                        )
                    }
                </div>
            </div>
            <Footer extras={footer} before={footerBefore}/>
        </React.Fragment>
    )
}
