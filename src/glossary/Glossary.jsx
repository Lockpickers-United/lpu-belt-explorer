import React, {useCallback, useState} from 'react'
import glossary from '../data/glossary.json'
import GlossaryEntry from './GlossaryEntry'
import ReactMarkdown from 'react-markdown'
import glossaryIntro from '../resources/glossaryIntro.md?raw'
import Card from '@mui/material/Card'

function Glossary() {
    const [expanded, setExpanded] = useState()

    const handleExpand = useCallback(value => setExpanded(value), [])

    return (
        <div style={{
            margin: 8, paddingBottom: 32,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginButtom: 16
        }}>

            <Card style={{
                maxWidth: 700, marginLeft: 'auto', marginRight: 'auto',
                padding: '6px 20px', borderBottom: '1px solid #333', bordertop: '1px solid #333', borderRadius: 0
            }}>
                <ReactMarkdown>
                    {glossaryIntro}
                </ReactMarkdown>
            </Card>

            {glossary.map(entry => {
                const isExpanded = expanded === entry.term

                return (
                    <GlossaryEntry
                        key={entry.term}
                        entry={entry}
                        expanded={isExpanded}
                        onExpand={handleExpand}
                    />
                )
            })}
        </div>
    )
}

export default Glossary
