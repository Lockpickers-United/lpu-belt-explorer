import React, {useState, useContext, useDeferredValue} from 'react'
import SafelockEntry from '../safelocks/SafelockEntry.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import DataContext from '../context/DataContext'

function SafelocksCollectionPage({profile}) {
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: 0, backgroundColor: '#222',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 0
            }}>

                <InlineFilterDisplay profile={profile} collectionType={'safelocks'}/>

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
