import React, {useCallback, useContext, useEffect} from 'react'
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
import FilterContext from '../context/FilterContext.jsx'
import {useNavigate} from 'react-router-dom'

function InfoPage() {
    const updateTime = '09/25/2025'

    const navigate = useNavigate()
    const {filters} = useContext(FilterContext)
    const sectionId = filters?.id

    const handleClick = useCallback(id => {
        navigate(`/info?id=${id}`)
    }, [navigate])

    const scrollIntoView = (id) => {
        const domElement = document.getElementById(id)
        window.scrollTo({
            left: 0,
            top: domElement.offsetTop - 75,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (sectionId && document.getElementById(sectionId)) {
            scrollIntoView(sectionId)
        }
    },[sectionId])

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
            <li key={id} style={{marginTop: 2}}>
                <Link onClick={() => handleClick(id)}
                       style={{color: '#fff', textDecorationColor: '#aaa', cursor: 'pointer', fontWeight:600}}>{section}</Link>
            </li>
        )
    })

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

                    <div style={{fontSize:'1.4rem', fontWeight: 700}}>Table of Contents</div>
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
