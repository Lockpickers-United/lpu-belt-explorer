import React, {useCallback, useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import FilterContext from './FilterContext.jsx'
import InlineFilterDisplay from './InlineFilterDisplay.jsx'
import BeltRequirements from './BeltRequirements.jsx'
import DataContext from './DataContext.jsx'

function Entries({expanded, onExpand, tab, onChangeTab}) {
    const {filters, removeFilter} = useContext(FilterContext)
    const {id} = filters
    const {visibleEntries, beltedEntries} = useContext(DataContext)

    const defTab = useDeferredValue(tab)

    const handleExpand = useCallback(value => {
        if (id && value && value !== id) {
            removeFilter('id')
        }
        onExpand(value)
    }, [id, removeFilter, onExpand])

    const entries = useMemo(() => {
        if (defTab === 'search') {
            return visibleEntries
        } else {
            return beltedEntries[defTab]
        }
    }, [beltedEntries, defTab, visibleEntries])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay tab={defTab} onChangeTab={onChangeTab}/>
                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.map(datum =>
                    <Entry
                        key={datum.id}
                        entry={datum}
                        expanded={expanded === datum.id}
                        onAccordionChange={handleExpand}
                    />
                )}
            </div>

        </React.Fragment>
    )
}

export default Entries
