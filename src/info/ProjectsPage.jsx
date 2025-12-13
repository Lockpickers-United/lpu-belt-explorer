import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React, {useCallback, useContext, useEffect} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import projectsMd from '../resources/projects.md?raw'
import projectsIntroMd from '../resources/projectsIntro.md?raw'
import '../resources/md-tables.css'
import {useNavigate} from 'react-router-dom'
import FilterContext from '../context/FilterContext.jsx'
import Link from '@mui/material/Link'

export default function ProjectsPage() {

    const navigate = useNavigate()
    const {filters} = useContext(FilterContext)
    const sectionId = filters?.id

    const handleClick = useCallback(id => {
        navigate(`/projects?id=${id}`)
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
    }, [sectionId])

    const sectionIds = {
        'Case Making Project Guidelines': 'case-making-project-guidelines',
        'Challenge Lock Making': 'challenge-lock-making',
        'Community Involvement': 'community-involvement',
        'Cutaway Making': 'cutaway-making',
        'Disc Detainer Pick Making': 'disc-detainer-pick-making',
        'Impressioning': 'impressioning',
        'Pick Making': 'pick-making',
        'Safe Lock Manipulation': 'safe-lock-manipulation',
        'Tool Making': 'tool-making',
        'Other Approved Projects': 'other-approved-projects'
    }
    const sections = [
        'Case Making Project Guidelines',
        'Challenge Lock Making',
        'Community Involvement',
        'Cutaway Making',
        'Disc Detainer Pick Making',
        'Impressioning',
        'Lock Design',
        'Lock Manufacturing',
        'Pick Making',
        'Picking Instruction',
        'Safe Lock Manipulation',
        'Tool Making',
        'Tool Manufacturing',
        'Other Approved Projects'
    ]
    const toc = sections.map(section => {
        const id = sectionIds[section]
        return (
            <li key={section} style={{marginTop: 2}}>
                {id
                    ? <Link onClick={() => handleClick(id)}
                            style={{
                                color: '#fff',
                                textDecorationColor: '#aaa',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}>{section}</Link>
                    : <div style={{
                        color: '#fff',
                        textDecorationColor: '#aaa',
                        fontWeight: 400
                    }}>{section}</div>
                }
            </li>
        )
    })

    const MarkdownRenderer = ({content}) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16,
                padding: '0px 30px'
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]} remarkPlugins={[remarkGfm]}>
                        {String(projectsIntroMd)}
                    </ReactMarkdown>

                    <ul>{toc}</ul>

                    <MarkdownRenderer content={projectsMd}/>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}