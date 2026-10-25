import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Card from '@mui/material/Card'
import ReactMarkdown from 'react-markdown'
import GlossaryImage from './GlossaryImage'

function GlossaryEntry({entry, highlighted}) {
    const ref = useRef()
    const [scrolled, setScrolled] = useState(false)

    const cardStyle = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0px 20px',
        borderRadius: 0,
        backgroundColor: highlighted ? '#222' : undefined
    }

    useEffect(() => {
        if (highlighted && ref && !scrolled) {
            setTimeout(() => {
                setScrolled(true)
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - 74
                })
            }, 0)
        }
    }, [highlighted, entry, scrolled])

    const markdown = useMemo(() => {
        let value = `\`${entry.term}\`. ${entry.definition}`
        if (entry.media?.title) {
            const photoCredit = entry.media.title.charAt(0).toLowerCase() + entry?.media.title.slice(1)
            value += ` (Photo ${photoCredit})`
        }
        return value
    }, [entry])

    const GlossaryTerm = ({children: term}) => {
        const safeTerm = encodeURI(term)
        const href = `https://share.lpubelts.com/?term=${safeTerm}`

        const handleClick = useCallback(async event => {
            event.preventDefault()
            await navigator.clipboard.writeText(href)
            enqueueSnackbar('Link copied to clipboard.')
        }, [href])

        const style = {
            fontWeight: 700,
            fontSize: '1.1rem',
            marginBottom: 4,
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'none'
        }

        return (
            <a aria-label={term} role='term' style={style} onClick={handleClick} href={href}>
                {term}
            </a>
        )
    }

    const markdownComponents = {
        code: GlossaryTerm
    }

    return (
        <Card style={cardStyle} ref={ref}>
            <div style={{color: '#ddd'}}>
                <GlossaryImage entry={entry} highlighted={highlighted}/>

                <ReactMarkdown components={markdownComponents}>
                    {markdown}
                </ReactMarkdown>
            </div>
        </Card>
    )
}

export default GlossaryEntry
