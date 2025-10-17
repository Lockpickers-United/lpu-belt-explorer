import React, {useState, useContext, useDeferredValue, useEffect} from 'react'
import SafelockEntry from '../safelocks/SafelockEntry.jsx'
import DataContext from '../context/DataContext'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import FilterContext from '../context/FilterContext.jsx'

function SafelocksCollectionPage() {
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)
    const {setAdvancedFilterGroups, advancedFilterGroups} = useContext(FilterContext)

    const [initialRender, setInitialRender] = useState(true)
    useEffect(() => {
        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: 'collection',
            matchType: 'Is',
            operator: 'OR',
            values: ['Any']
        }
        if (initialRender && advancedFilterGroups().length === 0 ) setAdvancedFilterGroups([newGroup])
        setInitialRender(false)
    }, [advancedFilterGroups, initialRender, setAdvancedFilterGroups])

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: 0, backgroundColor: '#222',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 0
            }}>

                <AdvancedFilters/>

                {visibleEntries?.map(entry =>
                    <SafelockEntry
                        key={entry.id}
                        entry={entry}
                        expanded={entry.id === defExpanded}
                        onExpand={setExpanded}
                    />
                )
                }
            </div>
        </React.Fragment>
    )
}

export default SafelocksCollectionPage
