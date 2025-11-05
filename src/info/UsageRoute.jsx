import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import UsagePage from './UsagePage'

export default function UsageRoute() {
    usePageTitle('Usage Information')

    return (
        <React.Fragment>
            <Nav title='LPU Belt Explorer Usage'/>

            <UsagePage/>

            <Footer/>
        </React.Fragment>
    )
}