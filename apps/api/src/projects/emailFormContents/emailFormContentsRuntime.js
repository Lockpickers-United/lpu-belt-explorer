import {createEmailFormHandler} from './emailFormContents.js'
import {loadEmailFormConfig} from './emailFormContentsConfig.js'
import {loadDeprecatedKeysModule} from '../../util/deprecatedKeys.js'

let defaultRuntimePromise

function createDisabledHandler() {
    return async function emailFormDisabled(_req, res) {
        return res.status(503).json({
            error: {
                code: 'email_form_disabled',
                message: 'Email form is not enabled'
            }
        })
    }
}

function validateRecipients(recipients) {
    const valid = typeof recipients === 'string'
        ? recipients.trim().length > 0
        : Array.isArray(recipients)
            && recipients.length > 0
            && recipients.every(recipient => typeof recipient === 'string' && recipient.trim())
    if (!valid) {
        const error = new Error('Email-form recipients are not configured')
        error.code = 'email_form_recipients_missing'
        throw error
    }
    return recipients
}

export async function createEmailFormRuntime({env = process.env} = {}) {
    const config = loadEmailFormConfig({env})
    if (!config.enabled) {
        return Object.freeze({config, handler: createDisabledHandler()})
    }

    const [mailerModule, usersModule] = await Promise.all([
        import('../nodeMailer/nodeMailer.js'),
        loadDeprecatedKeysModule('users.js', {env})
    ])
    const handler = createEmailFormHandler({
        runtimeEnvironment: config.runtimeEnvironment,
        emailSender: mailerModule.sendEmail,
        emailRecipients: validateRecipients(usersModule.raflEmailRecipients)
    })

    return Object.freeze({config, handler})
}

export async function getDefaultEmailFormHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createEmailFormRuntime()
    return (await defaultRuntimePromise).handler
}
