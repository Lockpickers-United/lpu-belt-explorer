import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import GithubButton from '../nav/GithubButton'
import Link from '@mui/material/Link'

import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import introMd from '../resources/intro.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'

function InfoPage() {
    const updateTime = '02/10/2025'

    const MarkdownRenderer = ({content}) => {
        return (
            <ReactMarkdown
                remarkPlugins={[]}
                rehypePlugins={[[rehypeExternalLinks, {
                    target: '_blank',
                    rel: ['nofollow', 'noopener', 'noreferrer']
                }]]}
                components={{
                    h1: ({node, ...props}) => <h1
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />,
                    h2: ({node, ...props}) => <h2
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />,
                    h3: ({node, ...props}) => <h3
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />,
                    h4: ({node, ...props}) => <h4
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />,
                    h5: ({node, ...props}) => <h5
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />,
                    h6: ({node, ...props}) => <h6
                        id={node.children[0].value.toLowerCase().replace(/ /g, '-')} {...props} />
                }}>{content}
            </ReactMarkdown>
        )
    }

    const sections = [
        'Earn Lockpicking Karate Flair',
        'Belt Request Instructions',
        'FAQ',
        'General Rules',
        'Video Requirements',
        'Blue Belt Project Requirements',
        'SFIC Filming Requirements',
        'Changes to Lock Rankings'
    ]
    const toc = sections.map(section => {
        const id = section.toLowerCase().replace(/ /g, '-')
        return (
            <li key={id}>
                <Link onClick={() => scrollIntoView(id)}
                       style={{color: '#fff', textDecoration: 'none', cursor: 'pointer'}}>{section}</Link>
            </li>
        )
    })

    const scrollIntoView = (id) => {
        const domElement = document.getElementById(id)
        window.scrollTo({
            left: 0,
            top: domElement.offsetTop - 75,
            behavior: 'smooth'
        })
    }

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardHeader title='Belt Requirements' action={
                    <GithubButton
                        url='https://github.com/Lockpickers-United/lpu-belt-explorer/blob/gh-pages/belts.md'/>
                }/>
                <CardContent>

                    <h2>Table of Contents</h2>
                    <ul>{toc}</ul>
                    <MarkdownRenderer content={markdown}/>

                </CardContent>
                <CardActions>
                    Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const markdown = [
    introMd,
    infoMd,
    changelogMd
].join('\n\n---\n\n')

export default InfoPage
