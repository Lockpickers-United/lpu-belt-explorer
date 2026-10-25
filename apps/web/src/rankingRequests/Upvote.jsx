import React from 'react'

export default function Upvote({upvote, voteNum}) {

    const {notes, discordUsername, redditUsername, userBelt} = upvote
    const userName = [discordUsername && `@${discordUsername}`,
        redditUsername && `u/${redditUsername.replace(/^\/*u\//, '')}`]
        .filter(Boolean)
        .join(' • ')
    const userBeltName = userBelt && ` (${userBelt})`
    const notesText = notes?.length > 0 ? `> ${notes}` : ''

    return (
        <div style={{marginBottom: 10}}>
            {voteNum+1}. <strong>{userName}</strong>{userBeltName} {notesText}
        </div>
    )
}