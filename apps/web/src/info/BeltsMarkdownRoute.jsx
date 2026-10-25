import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import BeltsMarkdownPage from './BeltsMarkdownPage.jsx'

function BeltsMarkdownRoute() {
    usePageTitle('Belt Requirements')

    return (
        <React.Fragment>
            <Nav title='Belt Requirements Markdown'/>

            <BeltsMarkdownPage showLocks={true}/>

            <Footer/>

        </React.Fragment>
    )
}

export default BeltsMarkdownRoute
