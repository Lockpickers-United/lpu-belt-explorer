import React from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import allEntries from '../data/data.json'
import {DataProvider} from '../locks/LockDataProvider.jsx'
import EmailVote from './EmailVote.jsx'

export default function EmailVoteRoute() {
    usePageTitle('Classification Vote')
    const {isMobile} = useWindowSize()
    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )
    return (
            <DataProvider allEntries={allEntries} profile={{}}>
                <Nav title='Classification' extras={extras}/>
                <EmailVote/>
            </DataProvider>
    )
}