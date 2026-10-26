import React from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import terms from '../data/bulkSearchTerms'
import SearchedLockEntries from '../rankingRequests/SearchedLockEntries.jsx'

function LockSearch() {
    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Bulk Search' extras={extras}/>

            {terms.map(term =>
                <div key={term} style ={{margin: '5px 5px 5px 50px'}}>
                    {term}<br/>
                    <SearchedLockEntries key={term} term={term} entry={{makeModels: [{model: term.replace(/\(.*\)/g, '')}]}}
                                         requestMod={true}/>
                </div>
            )}
            <Tracker feature='locks'/>
        </React.Fragment>
    )
}

export default LockSearch
