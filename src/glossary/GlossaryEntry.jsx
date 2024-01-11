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
                    top: ref.current.offsetTop - 74,
                    behavior: 'smooth'
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

    const GlossaryTerm = ({children}) => {
        const [term] = children

        const handleClick = useCallback(async event => {
            event.preventDefault()

            const link = `https://lpubelts.com/?term=${term}`

            await navigator.clipboard.writeText(link)
            enqueueSnackbar('Link copied to clipboard.')
        }, [term])

        const style = {
            fontWeight: 700,
            fontSize: '1.1rem',
            marginBottom: 4,
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'none'
        }

        return (
            <a style={style} onClick={handleClick} href={`/#/glossary?term=${term}`}>{term}</a>
        )
    }

    const markdownComponents = {
        code: GlossaryTerm
    }

    return (
        <Card style={cardStyle} ref={ref}>
            <div style={{color: '#ddd'}}>
                <GlossaryImage entry={entry}/>

                <ReactMarkdown components={markdownComponents} style={{}}>
                    {markdown}
                </ReactMarkdown>
            </div>
        </Card>
    )
}

export default GlossaryEntry
