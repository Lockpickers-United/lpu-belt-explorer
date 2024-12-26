import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import ImportTest from './ImportTest.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'

function ImportTestRoute() {

    usePageTitle('Test Import')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Test Import' extras={nav}/>

            ImportTest

            <Footer/>
        </React.Fragment>
    )
}

export default ImportTestRoute