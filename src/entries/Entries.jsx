import React, {useContext} from 'react'
import Entry from './Entry.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import BeltRequirements from '../info/BeltRequirements.jsx'
import AppContext from '../contexts/AppContext.jsx'
import Progress from '../nav/Progress.jsx'
import useSlowData from '../contexts/useSlowData.jsx'

function Entries() {
    const {expanded, setExpanded} = useContext(AppContext)
    const {value, progress} = useSlowData()

    return (
        <React.Fragment>
            <Progress value={progress}/>

            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay/>

                <BeltRequirements/>

                {value.map(entry =>
                    <Entry
                        key={entry.id}
                        entry={entry}
                        expanded={entry.id === expanded}
                        onExpand={setExpanded}
                    />
                )}
            </div>

        </React.Fragment>
    )
}

export default Entries
