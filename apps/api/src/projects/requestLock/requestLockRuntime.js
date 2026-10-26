import fs from 'node:fs/promises'
import {getFirebaseAdminServices} from '../../api/services/firebaseAdmin.js'
import {createRequestLockHandlers} from './requestLock.js'
import {loadRequestLockConfig} from './requestLockConfig.js'
import {loadDeprecatedKeysModule} from '../../util/deprecatedKeys.js'

let defaultRuntimePromise

export async function createRequestLockRuntime({env = process.env} = {}) {
    const config = loadRequestLockConfig({env})
    const {db, auth} = getFirebaseAdminServices(config)
    await fs.mkdir(config.uploadDir, {recursive: true})

    const [mailerModule, usersModule, activityModule] = await Promise.all([
        import('../nodeMailer/nodeMailer.js'),
        loadDeprecatedKeysModule('users.js', {env}),
        import('../logFirebaseActivity/logFirebaseActivity.js')
    ])

    const handlers = createRequestLockHandlers({
        db,
        auth,
        uploadDir: config.uploadDir,
        publicImageBaseUrl: config.publicImageBaseUrl,
        runtimeEnvironment: config.runtimeEnvironment,
        productionData: config.productionData,
        activityLogger: activityModule.logFirebaseActivity,
        emailSender: mailerModule.sendEmail,
        emailRecipients: usersModule.contentUploadRecipients
    })

    return Object.freeze({config, handlers})
}

export async function getDefaultRequestLockHandlers() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createRequestLockRuntime()
    return (await defaultRuntimePromise).handlers
}
