import Snoowrap from 'snoowrap'
import fs from 'node:fs/promises'
import {flairDetails} from './flairs.js'

const keys = JSON.parse(await fs.readFile('../../../keys/reddit-keys.json', 'utf8'))

const {client_id, client_secret, refresh_token} = keys

const reddit = new Snoowrap({
    userAgent: 'modmail-sync-checker by u/mgsecure',
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
})


// mod convo 2m8ufn

async function getModmailUsername(conversationId) {
    await reddit.getMe()
    const convo = await reddit.getNewModmailConversation(conversationId)
    const details = await convo.fetch()
    return details?.messages[0]?.author?.name?.name
}

async function setFlair(subredditName, username, belt) {
    const {text, cssClass} = flairDetails[belt]
    console.log('flair', text, cssClass)
    await reddit.getMe()

    await reddit.getSubreddit(subredditName).deleteUserFlair(username)

    await reddit
        .getSubreddit(subredditName)
        .setMultipleUserFlairs([
            {
                name: username,
                text,
                cssClass
            }
        ])
    return belt
}

async function _modmailReply(conversationId, belt, replyText = undefined, isAuthorHidden = true) {
    if (!replyText) {
        const {defaultMessage} = flairDetails[belt]
        replyText = defaultMessage
    }
    await reddit.getMe()
    const convo = await reddit.getNewModmailConversation(conversationId)
    await convo.reply(replyText, isAuthorHidden, false)
}


async function setFlairRaw(subredditName, username, templateid) {
    await reddit.getMe()
    const token = reddit.accessToken

    const url = `https://oauth.reddit.com/r/${subredditName}/api/selectflair`
    const body = new URLSearchParams({
        api_type: 'json',
        name: username,
        flair_template_id: templateid,
    })

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': reddit._config.userAgent,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    })

    const json = await res.json()
    if (!res.ok || (json.json?.errors?.length)) {
        throw new Error(`Flair API error: ${JSON.stringify(json.json?.errors || res.status)}`)
    }
    return json
}



;(async () => {

    const subredditName = 'lockpicking' // example subreddit
    const conversationId = '2r2n2d' // example modmail conversation ID
    const belt = 'Orange' // example belt

    let username = undefined
    let newFlair = undefined
    let error = undefined

    await reddit.getMe()
    console.log('Scopes granted:', reddit.scope)



    try {
        username = await getModmailUsername(conversationId)
    } catch (err) {
        console.error('Failed to get modmail username', err.error)
        error = err.error
    }

    const {_text, _cssClass, id} = flairDetails[belt]
    await setFlairRaw('lockpicking', username, id)

    return

    if (username) try {
        newFlair = await setFlair(subredditName, username, belt)
    } catch (err) {
        console.error('Failed to set user flair', err)
        error = 'Failed to set user flair'
    }

    if (newFlair) try {
        //await modmailReply(conversationId, belt)
    } catch (err) {
        console.error('Failed to reply to modmail', err.error)
        error = 'Failed to reply to modmail'
    }

    if (error) {
        console.error('Error occurred:', error)
    } else {
        console.log(`Successfully set flair for ${username} to ${newFlair} in subreddit ${subredditName}`)
    }

})()