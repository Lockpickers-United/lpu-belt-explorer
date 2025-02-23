import React, {useState} from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import {encodeNonAsciiHTML} from 'entities'
import CopyMarkdownButton from './CopyMarkdownButton'
import {uniqueBelts} from '../data/belts'
import rawData from '../data/data.json'

import introMd from '../resources/intro.md?raw'
import beltExplorerPromoMd from '../resources/beltExplorerPromo.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'
import footerMd from '../resources/footer.md?raw'

import white from '../resources/beltRequirements/white.md?raw'
import yellow from '../resources/beltRequirements/yellow.md?raw'
import orange from '../resources/beltRequirements/orange.md?raw'
import green from '../resources/beltRequirements/green.md?raw'
import blue from '../resources/beltRequirements/blue.md?raw'
import purple from '../resources/beltRequirements/purple.md?raw'
import brown from '../resources/beltRequirements/brown.md?raw'
import red from '../resources/beltRequirements/red.md?raw'
import black from '../resources/beltRequirements/black.md?raw'

const beltRequirements = {
    white, yellow, orange, green, blue, purple, brown, red, black
}

import greenSpecial from '../resources/specialRequirements/green.md?raw'
import blueSpecial from '../resources/specialRequirements/blue.md?raw'
import purpleSpecial from '../resources/specialRequirements/purple.md?raw'
import brownSpecial from '../resources/specialRequirements/brown.md?raw'
import redSpecial from '../resources/specialRequirements/red.md?raw'
import blackSpecial from '../resources/specialRequirements/black.md?raw'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'

const specialRequirements = {
    green: greenSpecial,
    blue: blueSpecial,
    purple: purpleSpecial,
    brown: brownSpecial,
    red: redSpecial,
    black: blackSpecial
}

const initialVal = uniqueBelts.reduce((acc, val) => ({...acc, [val]: []}), [])
const groupedByBelt = rawData.reduce((acc, val) => {
    const belt = val.belt.replace(/\s\d/g, '')
    if (acc[belt]) acc[belt].push(val)
    return acc
}, initialVal)

function BeltsMarkdownPage() {

    const [preview, setPreview] = useState(true)

    const beltsMd = uniqueBelts.map(belt => {
        const actualBelt = belt.toLowerCase()
        const header = `### ${belt} Belt\n![](%%${actualBelt}%%)\n\n`
        const entriesHeader = `**${belt} Belt Locks**\n\n`
        const reqs = beltRequirements[actualBelt]

        const specialReqs = specialRequirements[actualBelt] || ''

        const entries = groupedByBelt[belt].map(entry => {
            const makeModels = entry.makeModels.map(({make, model}) => {
                return encodeNonAsciiHTML(make && make !== model ? `${make} ${model}` : model)
            }).join(' / ')
            const url = `https://lpubelts.com/#/locks?id=${entry.id}`
            const version = encodeNonAsciiHTML(entry.version ? ` (${entry.version})` : '')
            return `- [${makeModels}](${url})${version}`
        }).join('\n')
        return header + reqs + '\n\n' + entriesHeader + entries + '\n\n' + specialReqs
    }).join('\n\n')

    const markdown = [
        introMd,
        beltExplorerPromoMd,
        beltsMd,
        changelogMd,
        infoMd,
        footerMd
    ].join('\n\n---\n\n')

    const markdownLinks = markdown.replace(/\((\/#\/\w+)\)/g, '(https://lpubelts.com$1)')

    return (
        <React.Fragment>

            <div style={{flexGrow: 1, textAlign: 'center', margin: 20}}>
                <ToggleButtonGroup
                    variant='outlined'
                    size='large'
                >
                    <ToggleButton onClick={() => setPreview(true)}
                                  selected={preview}
                                  disabled={preview}
                                  value='preview'
                                  style={{padding: '2px 12px 2px 12px'}}>
                        Preview
                    </ToggleButton>
                    <ToggleButton onClick={() => setPreview(false)}
                                  selected={!preview}
                                  disabled={!preview}
                                  value='markdown'
                                  style={{padding: '2px 12px 2px 12px'}}>
                        Markdown
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardHeader title='Belt Requirements' action={
                    <CopyMarkdownButton content={markdownLinks}/>
                }/>
                <CardContent>

                    {preview
                        ? <ReactMarkdown
                            remarkPlugins={[]}
                            rehypePlugins={[[rehypeExternalLinks, {
                                target: '_blank',
                                rel: ['nofollow', 'noopener', 'noreferrer']
                            }]]}>{markdown.replace(/!\[]\(%%\w*%%\)/g, '')}</ReactMarkdown>
                        : <div style={{fontSize: '0.9rem'}}>
                            <pre>{markdownLinks}</pre>
                        </div>
                    }
                </CardContent>
                <CardActions>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}


export default BeltsMarkdownPage
