import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
//import LockMechanismScopes from './LockMechanismScopes.jsx'
import SankeyTest from './SankeyTest.jsx'

function TestPageRoute() {
    usePageTitle('Test Page')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Test Page' extras={nav}/>

            <div style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16,
                padding: '0px 30px'
            }}>
                <SankeyTest/>
            </div>

            <Footer/>
        </React.Fragment>
    )
}

export default TestPageRoute

