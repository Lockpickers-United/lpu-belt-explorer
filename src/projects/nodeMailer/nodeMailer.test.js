import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {describe, expect, it, vi} from 'vitest'
import {loadEmailConfigs, sendEmail} from './nodeMailer.js'

describe('loadEmailConfigs', () => {
    it('loads emailConfigs from the module named by EMAIL_CONFIG_PATH', async () => {
        const emailConfigs = {
            content: {
                name: 'LPU Belts',
                user: 'sender@example.test',
                pass: 'secret'
            }
        }
        const importConfig = vi.fn().mockResolvedValue({emailConfigs})
        const cwd = path.resolve('/application')
        const configuredPath = 'shared/credentials/emailConfigurations.js'

        await expect(loadEmailConfigs({
            env: {EMAIL_CONFIG_PATH: configuredPath},
            cwd,
            importConfig
        })).resolves.toBe(emailConfigs)
        expect(importConfig).toHaveBeenCalledWith(
            pathToFileURL(path.resolve(cwd, configuredPath)).href
        )
    })

    it('rejects a missing EMAIL_CONFIG_PATH', async () => {
        await expect(loadEmailConfigs({env: {}})).rejects.toMatchObject({
            code: 'email_config_path_missing',
            message: 'EMAIL_CONFIG_PATH is required'
        })
    })

    it('rejects a module without an emailConfigs export', async () => {
        await expect(loadEmailConfigs({
            env: {EMAIL_CONFIG_PATH: '/config/email.js'},
            importConfig: vi.fn().mockResolvedValue({})
        })).rejects.toMatchObject({
            code: 'email_configs_invalid'
        })
    })

    it('wraps failures while importing the configured module', async () => {
        const cause = new Error('file not found')

        await expect(loadEmailConfigs({
            env: {EMAIL_CONFIG_PATH: '/config/email.js'},
            importConfig: vi.fn().mockRejectedValue(cause)
        })).rejects.toMatchObject({
            code: 'email_config_unavailable',
            cause
        })
    })
})

describe('sendEmail', () => {
    it('uses the selected email config to send the application message shape', async () => {
        const sendMail = vi.fn().mockResolvedValue({messageId: 'message-id'})
        const transportFactory = vi.fn().mockReturnValue({sendMail})
        const emailConfigLoader = vi.fn().mockResolvedValue({
            content: {
                name: 'LPU Belts',
                user: 'sender@example.test',
                pass: 'secret'
            }
        })
        const content = {
            emailConfig: 'content',
            to: ['recipient@example.test'],
            subject: 'Test message',
            text: 'Plain text body',
            html: '<p>HTML body</p>',
            attachments: [{filename: 'report.txt', content: 'attachment'}]
        }

        await expect(sendEmail(content, {
            env: {EMAIL_CONFIG_PATH: '/config/email.js'},
            cwd: '/application',
            emailConfigLoader,
            transportFactory
        })).resolves.toEqual({messageId: 'message-id'})

        expect(emailConfigLoader).toHaveBeenCalledWith({
            env: {EMAIL_CONFIG_PATH: '/config/email.js'},
            cwd: '/application'
        })
        expect(transportFactory).toHaveBeenCalledWith({
            host: 'smtp.dreamhost.com',
            port: 587,
            secure: false,
            auth: {
                user: 'sender@example.test',
                pass: 'secret'
            }
        })
        expect(sendMail).toHaveBeenCalledWith({
            from: '"LPU Belts" <sender@example.test>',
            to: ['recipient@example.test'],
            subject: 'Test message',
            text: 'Plain text body',
            html: '<p>HTML body</p>',
            attachments: [{filename: 'report.txt', content: 'attachment'}]
        })
    })

    it('rejects an unknown email configuration', async () => {
        await expect(sendEmail({emailConfig: 'missing'}, {
            emailConfigLoader: vi.fn().mockResolvedValue({}),
            transportFactory: vi.fn()
        })).rejects.toMatchObject({
            code: 'email_config_unknown',
            message: 'Email configuration is not defined: missing'
        })
    })
})
