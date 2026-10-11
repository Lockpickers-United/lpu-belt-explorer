import React, {useContext} from 'react'
import BeltStripe from '../entries/BeltStripe'
import entryName from '../entries/entryName'
import ClassificationContext from '../app/ClassificationContext.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import changelogEntryFormat from './changelogEntryFormat.js'

function ChangelogEntry({entry}) {
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const {
        getAdminAction
    } = useContext(ClassificationContext)

    const adminAction = getAdminAction(entry)

    // sameline with Gera 3000 on BLUE
    const name = entryName(entry, 'short')
    const belt = adminAction.updatedBelt || adminAction.samelineLock?.belt || entry.belt

    return (
        <div style={style} aria-label={name}>
            <div style={{alignItems: 'center', position: 'relative', paddingLeft: 12, marginTop: 16}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '8px 16px',
                    padding: '6px 0',
                    flexShrink: 0,
                    flexDirection: 'column'
                }}>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                   remarkPlugins={[remarkGfm]}
                                   components={{p: 'div'}}
                    >
                        {changelogEntryFormat({entry, linebreak: true}).replace(/^-/g, '')}
                    </ReactMarkdown>
                </div>

            </div>
        </div>
    )
}

export default React.memo(ChangelogEntry)
