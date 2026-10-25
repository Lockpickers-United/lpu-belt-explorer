import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
//import LockMechanismScopes from './LockMechanismScopes.jsx'
//import BeltFlowSankey from './BeltFlowSankey.jsx'
import BeltFlowChord from './BeltFlowChord.jsx'

function TestPageRoute() {
    usePageTitle('Test Page')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Test Page' extras={nav}/>

            <div style={{
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16,
                padding: '0px 30px'
            }}>
                <BeltFlowChord/>
            </div>

            <Footer/>
        </React.Fragment>
    )
}

export default TestPageRoute

