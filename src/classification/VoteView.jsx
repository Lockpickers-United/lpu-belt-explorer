import React from 'react'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import Button from '@mui/material/Button'
import AttachmentIcon from '@mui/icons-material/Attachment'
import {useAccess} from '../app/AccessContext.jsx'

export default function VoteView({vote = {}, handleActive, owner}) {
    const {accessInfo} = useAccess()

    const description = owner ? 'My Vote: ' : `${vote.displayName}: `

    const buttonColor = owner ? '#ddd' : '#e16936'

    return (
        <div style={{
            fontSize: '0.9rem',
            width: '100%',
            position: 'relative',
            margin: '16px 16px 0px 0px'
        }}>
            <BeltStripeMini value={vote.votedBelt} width={6} offset={0}
                            style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>

            <div style={{margin: '4px 0 0 16px', paddingRight: 8, width: '100%', overflow: 'hidden'}}>
                <div style={{fontSize: '1.0rem', marginTop: 16}}>
                    <span style={{fontWeight: 600}}>{description}</span>
                    &nbsp;{vote.votedBelt} {/black (\d)/.test(vote.votedBelt?.toLowerCase()) ? '' : ' Belt'}
                </div>
                {vote.comment &&
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]}>
                        {vote.comment}
                    </ReactMarkdown>
                }
                {vote.mediaUrl &&
                    <div style={{
                        display: 'flex', flexDirection: 'row', gap: 8,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        <AttachmentIcon fontSize={'small'}/>
                        <a href={vote.mediaUrl} target='_blank'
                           rel='nofollow noopener noreferrer'>{vote.mediaUrl}</a>
                    </div>
                }

                {(owner || accessInfo.roles.classificationAdmin) &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
                        <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                                style={{color: buttonColor}}>Edit</Button>
                    </div>
                }
            </div>
        </div>
    )
}
