import React, {useContext, useState} from 'react'
import DataContext from '../../context/DataContext.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import Nav from '../../nav/Nav.jsx'
import BeltRequestEntry from './BeltRequestEntry.jsx'
import AdvancedFilters from '../../filters/AdvancedFilters.jsx'
import SearchBox from '../../nav/SearchBox.jsx'
import ViewFilterButtons from '../../filters/ViewFilterButtons.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import {beltRequestSortFields} from '../../data/sortFields.js'
import FilterContext from '../../context/FilterContext.jsx'

export default function RequestAdmin() {
    usePageTitle('Belt Request Admin')

    const {visibleEntries = []} = useContext(DataContext)
    console.log('visibleEntries', visibleEntries[0])
    const {filters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)


    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            <SearchBox label='Requests' keepOpen={false}
                       entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={beltRequestSortFields} advancedEnabled={true}
                               extraFilters={[{key: 'tab', value: 'search'}]}
                               resetAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Request Admin' extras={extras}/>
            <AdvancedFilters/>

            {visibleEntries.map((entry, index) =>
                <BeltRequestEntry
                    key={index}
                    entry={entry}
                    expanded={entry.id === entryExpanded
                        || visibleEntries.length === 1}
                    onExpand={setEntryExpanded}
                />
            )}

        </React.Fragment>
    )
}