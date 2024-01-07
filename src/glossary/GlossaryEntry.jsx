import React, {useEffect, useMemo, useRef, useState} from 'react'
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
            setScrolled(true)

            setTimeout(() => {
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

    const markdownComponents = {
        code({children}) {
            return <span style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                marginBottom: 4,
                color: '#fff'
            }}>{children}</span>
        }
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
