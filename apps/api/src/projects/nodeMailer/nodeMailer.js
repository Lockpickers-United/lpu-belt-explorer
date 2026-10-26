import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {createTransport} from 'nodemailer'

function emailConfigurationError(code, message, cause) {
    const error = new Error(message, cause ? {cause} : undefined)
    error.code = code
    return error
}

export async function loadEmailConfigs({
    env = process.env,
    cwd = process.cwd(),
    importConfig = configUrl => import(configUrl)
} = {}) {
    const configuredPath = env.EMAIL_CONFIG_PATH?.trim()
    if (!configuredPath) {
        throw emailConfigurationError(
            'email_config_path_missing',
            'EMAIL_CONFIG_PATH is required'
        )
    }

    const configUrl = configuredPath.startsWith('file:')
        ? configuredPath
        : pathToFileURL(path.resolve(cwd, configuredPath)).href

    let configModule
    try {
        configModule = await importConfig(configUrl)
    } catch (cause) {
        throw emailConfigurationError(
            'email_config_unavailable',
            `Unable to load email configuration: ${configUrl}`,
            cause
        )
    }

    if (!configModule.emailConfigs || typeof configModule.emailConfigs !== 'object') {
        throw emailConfigurationError(
            'email_configs_invalid',
            'Email configuration module must export an emailConfigs object'
        )
    }

    return configModule.emailConfigs
}

export async function sendEmail(content, {
    env = process.env,
    cwd = process.cwd(),
    emailConfigLoader = loadEmailConfigs,
    transportFactory = createTransport
} = {}) {
    const emailConfigs = await emailConfigLoader({env, cwd})
    const emailConfig = emailConfigs[content.emailConfig]

    if (!emailConfig) {
        throw emailConfigurationError(
            'email_config_unknown',
            `Email configuration is not defined: ${content.emailConfig}`
        )
    }

    const transporter = transportFactory({
        host: 'smtp.dreamhost.com',
        port: 587,
        secure: false,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    })

    return transporter.sendMail({
        from: `"${emailConfig.name}" <${emailConfig.user}>`,
        to: content.to,
        subject: content.subject,
        text: content.text,
        html: content.html,
        attachments: content.attachments
    })
}
