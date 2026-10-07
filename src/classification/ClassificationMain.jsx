import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import DataContext from '../context/DataContext.jsx'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {classificationSortFields} from '../data/sortFields'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ClassificationEntries from './ClassificationEntries.jsx'

export default function ClassificationMain() {
    usePageTitle('Classification')

    const {visibleEntries = []} = useContext(DataContext)

    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            <SearchBox label='Locks' keepOpen={false}
                       entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={classificationSortFields} visibleEntries={visibleEntries}
                               advancedEnabled={true} extraFilters={[]} entryType='Lock'
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Classification' extras={extras}/>

            <ClassificationEntries advancedEnabled={true}/>

            <Tracker feature='classification'/>

        </React.Fragment>
    )
}
