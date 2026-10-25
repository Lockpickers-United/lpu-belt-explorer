import React, {useContext} from 'react'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import DataContext from '../locks/LockDataProvider.jsx'
import entryName from '../entries/entryName'
import ReactMarkdown from 'react-markdown'
import usePageTitle from '../util/usePageTitle.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import useWindowSize from '../util/useWindowSize.jsx'
import Box from '@mui/material/Box'

export default function PathToBlack({page = {}}) {
    page?.title && usePageTitle('Path to Black: ' + page?.title)
    const navigate = useNavigate()

    const {getEntryFromId} = useContext(DataContext)

    const goToLock = (lockId) => {
        navigate(`/locks?id=${lockId}`)
    }

    const LockDisplay = ({idChildren, descriptions = []}) => {
        // Extract the id text from the first <li>'s children (could be a string or array)
        const idText = React.Children.toArray(idChildren)
            .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
            .flat()
            .join('')
            .trim()

        const lock = getEntryFromId(String(idText)) || {}
        const lockName = entryName(lock, 'any', {includeVersion: false})
        const beltName = lock?.belt
            ? lock.belt === 'Unranked'
                ? 'Unranked:'
                : lock.belt.replace(/ \d/, '') + ' Belt:'
            : ''
        const lockMedia = lock?.media || [{}]

        const linkSx = {
            color: '#ddd', textDecoration: 'underline', cursor: 'pointer', '&:hover': {
                color: '#fff'
            }
        }

        const {isMobile} = useWindowSize()
        const imageWidth = isMobile ? 85 : 150
        const textSize = isMobile ? '1.0rem' : '1.0rem'
        const titleSize = isMobile ? '1.1rem' : '1.2rem'
        const photoMargin = isMobile ? '6px 16px 0px 0' : '6px 24px 0px 0'

        return (<React.Fragment>
            <div style={{
                ...style,
                display: 'flex',
                alignItems: 'stretch',
                position: 'relative',
                backgroundColor: '#222',
                padding: '16px 32px',
            }}>
                <BeltStripeMini value={lock?.belt} style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0
                }}/>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative'}}>
                    <div style={{fontWeight: 600, fontSize: titleSize, marginBottom: 8}}>
                        {beltName} <Link onClick={() => {
                        goToLock(lock.id)
                    }} sx={linkSx}>{lockName}</Link>
                    </div>
                    <div style={{display: 'flex'}}>
                        {!isMobile && lockMedia[0]?.thumbnailUrl &&
                            <div style={{margin: photoMargin}}>
                                <Link onClick={() => {
                                    goToLock(lock.id)
                                }}><img style={{width: imageWidth}} src={lockMedia[0]?.thumbnailUrl}
                                        alt={lockName}/></Link>
                            </div>
                        }
                        <div>
                            {descriptions.map((d, i) => (
                                <div key={i} style={{marginBottom: 8, fontSize: textSize}}>{d}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }

    const NotesDisplay = ({idChildren, descriptions = []}) => {
        // Extract the id text from the first <li>'s children (could be a string or array)
        const idText = React.Children.toArray(idChildren)
            .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
            .flat()
            .join('')
            .trim()
        const lock = getEntryFromId(String(idText)) || {}
        const {isMobile} = useWindowSize()
        const textSize = isMobile ? '1.0rem' : '1.0rem'

        return (<React.Fragment>
            <div style={{
                ...style,
                display: 'flex',
                alignItems: 'stretch',
                position: 'relative',
                backgroundColor: '#222',
                padding: '16px 32px',
            }}>
                <BeltStripeMini value={lock?.belt} style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0
                }}/>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative'}}>
                    <div style={{display: 'flex'}}>
                        <div>
                            {descriptions.map((d, i) => (
                                <div key={i} style={{marginBottom: 8, fontSize: textSize}}>{d}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }



    function MarkdownFancy({markdown}) {
        const {isMobile} = useWindowSize()
        const textSize = isMobile ? '1.0rem' : '1.0rem'
        const titleSize = isMobile ? '1.5rem' : '1.7rem'
        const navLinkSx = {
            fontWeight: 400, color: '#888', textDecoration: 'none', cursor: 'pointer',
            '&:hover': {
                textDecoration: 'underline',
                color: '#fff'
            }
        }

        return (
            <ReactMarkdown
                components={{
                    ul: ({children}) => {
                        const extractText = (ch) => React.Children.toArray(ch)
                            .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
                            .flat()
                            .join('')
                            .trim()

                        const nodes = React.Children
                            .toArray(children)
                            .filter(React.isValidElement) // keep <li> only

                        const groups = []
                        let current = null

                        nodes.forEach((li) => {
                            const text = extractText(li.props.children)
                            const looksLikeId = !!getEntryFromId(String(text))
                            if (looksLikeId) {
                                // start a new group
                                if (current) groups.push(current)
                                current = {idChildren: li.props.children, descriptions: []}
                            } else {
                                // description line
                                if (!current) return // skip orphan description before any id
                                current.descriptions.push(li.props.children)
                            }
                        })
                        if (current) groups.push(current)

                        return <>{groups.map((g, i) => (
                            <LockDisplay key={`ld-${i}`} idChildren={g.idChildren} descriptions={g.descriptions}/>
                        ))}</>
                    },
                    ol: ({children}) => {
                        const extractText = (ch) => React.Children.toArray(ch)
                            .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
                            .flat()
                            .join('')
                            .trim()

                        const nodes = React.Children
                            .toArray(children)
                            .filter(React.isValidElement) // keep <li> only

                        const groups = []
                        let current = null

                        nodes.forEach((li) => {
                            const text = extractText(li.props.children)
                            const looksLikeId = !!getEntryFromId(String(text))
                            if (looksLikeId) {
                                // start a new group
                                if (current) groups.push(current)
                                current = {idChildren: li.props.children, descriptions: []}
                            } else {
                                // description line
                                if (!current) return // skip orphan description before any id
                                current.descriptions.push(li.props.children)
                            }
                        })
                        if (current) groups.push(current)

                        return <>{groups.map((g, i) => (
                            <NotesDisplay key={`ld-${i}`} idChildren={g.idChildren} descriptions={g.descriptions}/>
                        ))}</>
                    },
                    blockquote: ({children}) => <div style={{
                        ...style,
                        fontSize: textSize,
                        alignItems: 'stretch',
                        position: 'relative',
                        backgroundColor: '#2a2a2a',
                        borderBottom: '1px solid #000',
                        padding: '12px 18px 6px 18px'
                    }}>{children}</div>,
                    p: ({children}) => <div style={{marginBottom: 12, lineHeight: '1.5em'}}>
                        {children}</div>,
                    h1: ({children}) => <div style={{
                        ...style,
                        fontSize: titleSize,
                        fontWeight: 700,
                        backgroundColor: '#2a2a2a',
                        padding: '8px 0 0 18px',
                        borderBottom: 'none'
                    }}><Box component='span' style={{fontWeight: 400, color: '#666', fontSize: '1.2rem'}}>
                        <Link sx={navLinkSx} onClick={() => {
                            navigate('/pathtoblack')
                        }}>
                            path to black</Link> &gt; </Box>
                        <nobr>{children}</nobr>
                    </div>,
                    h6: ({children}) => <div style={{
                        ...style,
                        textAlign: 'right',
                        fontSize: '0.85rem',
                        padding: '8px 8px 0 18px',
                        borderBottom: 'none'
                    }}>{children}</div>
                }}
                remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {
                target: '_blank',
                rel: ['nofollow', 'noopener', 'noreferrer']
            }]]}
            >
                {markdown}
            </ReactMarkdown>
        )
    }

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '6px 20px',
        borderBottom: '1px solid #333',
        borderRadius: 0
    }

    return (
        <div style={{margin: 6}}>
            <MarkdownFancy markdown={page.content}/>
        </div>
    )
}
