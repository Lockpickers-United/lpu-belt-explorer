import fs from 'node:fs/promises'
import {createUploadContentHandler} from './uploadContent.js'
import {loadUploadContentConfig} from './uploadContentConfig.js'

let defaultRuntimePromise

export async function createUploadContentRuntime({env = process.env} = {}) {
    const config = loadUploadContentConfig({env})
    await fs.mkdir(config.uploadDir, {recursive: true})

    const [mailerModule, usersModule] = await Promise.all([
        import('../nodeMailer/nodeMailer.js'),
        import('../../../keys/users.js')
    ])

    const handler = createUploadContentHandler({
        uploadDir: config.uploadDir,
        runtimeEnvironment: config.runtimeEnvironment,
        emailSender: mailerModule.sendEmail,
        emailRecipients: usersModule.contentUploadRecipients
    })

    return Object.freeze({config, handler})
}

export async function getDefaultUploadContentHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createUploadContentRuntime()
    return (await defaultRuntimePromise).handler
}
