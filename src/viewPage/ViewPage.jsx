import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import Nav from '../nav/Nav.jsx'
import '../resources/md-tables.css'
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
import usePageTitle from '../util/usePageTitle.jsx'

import safeLocksTierOne from './pages/safelocksTierOne.md?raw'
import ladyLocksQuestInfo from './pages/ladyLocksQuestInfo.md?raw'

const pages = {
    safeLocksTierOne: {title: 'Tier 1 Safe/Combination Locks', content: safeLocksTierOne},
    tierThreeExample: {title: 'Tier 3 Submission Example', content: ladyLocksQuestInfo}
}


export default function ViewPage() {

    const location = useLocation()
    const {pageId} = queryString.parse(location.search)

    usePageTitle(pages[pageId]?.title || 'Page Not Found')

    return (
        <React.Fragment>
            <Nav title='Information'/>

            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16,
                padding: '0px 30px'
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]} remarkPlugins={[remarkGfm]}>
                        {pages[pageId]?.content || 'Page Not Found'}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}