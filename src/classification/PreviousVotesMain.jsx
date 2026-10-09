import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ClassificationToolbar from './ClassificationToolbar.jsx'

export default function PreviousVotesMain() {
    usePageTitle('Previous Votes')

    const {isMobile} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 24, padding: '0 8px', textAlign: 'center'}

    const extras = (
        <div style={{display: 'flex', marginTop: 6, alignItems: 'center', marginRight: 24}}>
            <div style={{flexGrow: 1, minWidth: !isMobile ? 10 : 0}}/>
        </div>
    )

    return (
        <React.Fragment>
            <Nav title='Previous' extras={extras}/>
            <ClassificationToolbar/>

            <div style={style}>
                1,927 previous votes here soon
            </div>

            <Tracker feature='classificationPrevious'/>

        </React.Fragment>
    )
}
