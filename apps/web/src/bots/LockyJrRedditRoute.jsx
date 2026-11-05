import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import privacyPolicyMd from './lockyJrReddit/PRIVACY.md?raw'
import termsMd from './lockyJrReddit/TOS.md?raw'
import {useMatches} from 'react-router-dom'

function LockyPrivacyRoute() {
    usePageTitle('Locky Jr Information')

    const content = useMatches().some(match => match.handle?.route === 'reddit.privacy') ? privacyPolicyMd : termsMd

    return (
        <React.Fragment>
            <Nav title='Locky Jr.'/>

            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {String(content)}
                    </ReactMarkdown>
                </CardContent>
            </Card>

            <Footer/>
        </React.Fragment>
    )
}

export default LockyPrivacyRoute
