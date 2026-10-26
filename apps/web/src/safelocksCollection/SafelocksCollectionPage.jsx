import React, {useState, useContext, useDeferredValue} from 'react'
import SafelockEntry from '../safelocks/SafelockEntry.jsx'
import DataContext from '../context/DataContext'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import useDefaultAdvancedFilterGroup from '../filters/useDefaultAdvancedFilterGroup.js'

function SafelocksCollectionPage() {
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)
    useDefaultAdvancedFilterGroup({fieldName: 'collection', value: 'Any'})

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
