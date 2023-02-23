import React, {useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import BeltRequirements from '../info/BeltRequirements.jsx'
import DataContext from '../contexts/DataContext.jsx'
import AppContext from '../contexts/AppContext.jsx'

function Entries() {
    const {visibleEntries, beltedEntries} = useContext(DataContext)
    const {tab} = useContext(AppContext)
    const defTab = useDeferredValue(tab)

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
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.map(datum => <Entry key={datum.id} entry={datum}/>)}
            </div>

        </React.Fragment>
    )
}

export default Entries
