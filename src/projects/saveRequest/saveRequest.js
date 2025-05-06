import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../../keys/users.js'

export default async function saveRequest(req, res) {

    //throw new Error('This function is deprecated. Use the new saveRequest function instead.')

    // https://explore.lpubelts.com:8443/save-request?request=62c261cf4ad5&notes=nice%20blue%20belt%20lock%20write-up&savedBy=mgsecure&submittedBy=userName&messageId=1345134515059691593&token=topsecret

    if (req.query.token !== 'topsecret') {
        res.status(401).send('Unauthorized.')
    } else if (!/\d{19}/.test(req.query.messageId)) {
        res.status(418).send('I\'m a teapot.')
    } else {

        let html = '<table>'
        for (const key in req.query) {
            html += `<tr><td>${key}</td><td>${req.query[key]}</td></tr>`
        }
        html += '</table>'
        html += '<br/><br/>'
        html += `LINK: https://discord.com/channels/140129091796992000/282173282546089985/${req.query.messageId}`

        try {
            const email = await sendEmail({
                emailConfig: 'content',
                to: contentUploadRecipients,
                subject: `Request from ${req.query.submittedBy} saved by ${req.query.savedBy} (${req.query.request})`,
                html: html
            })
            console.log('Message sent: %s', email.messageId)
            res.status(201).send(`Data for request ${req.query.request} saved successfully.`)
        } catch (error) {
            console.error('An error occurred sending email', error.message)
            res.status(500).send('Error processing form data.')
        }
    }
}
