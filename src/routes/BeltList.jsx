import React from 'react'
import Entries from '../entries/Entries'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'

function BeltList() {
    return (
        <React.Fragment>
            <Nav/>

            <Entries/>

            <Footer/>
        </React.Fragment>
    )
}

export default BeltList
