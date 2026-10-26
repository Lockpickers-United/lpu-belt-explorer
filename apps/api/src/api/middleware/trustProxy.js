import {isIP} from 'node:net'

const namedRanges = new Set(['loopback', 'linklocal', 'uniquelocal'])
const trustAllValues = new Set(['true', '*', 'all', '0.0.0.0/0', '::/0'])

function trustProxyConfigError(message) {
    const error = new Error(message)
    error.code = 'trust_proxy_config_invalid'
    return error
}

function isValidCidr(value) {
    const separatorIndex = value.lastIndexOf('/')
    if (separatorIndex <= 0 || separatorIndex === value.length - 1) return false

    const address = value.slice(0, separatorIndex)
    const prefixText = value.slice(separatorIndex + 1)
    const family = isIP(address)
    if (!family || !/^\d+$/.test(prefixText)) return false

    const prefix = Number(prefixText)
    const maxPrefix = family === 4 ? 32 : 128
    return prefix >= 0 && prefix <= maxPrefix
}

function isValidProxy(value) {
    return namedRanges.has(value.toLowerCase()) || isIP(value) !== 0 || isValidCidr(value)
}

export function getTrustProxyConfig(env = process.env) {
    if (env.TRUST_PROXY === undefined) return ['loopback']
    if (typeof env.TRUST_PROXY !== 'string' || !env.TRUST_PROXY.trim()) {
        throw trustProxyConfigError('TRUST_PROXY must not be empty')
    }

    const configuredValue = env.TRUST_PROXY.trim()
    if (configuredValue.toLowerCase() === 'false') return false

    const proxies = configuredValue.split(',').map(value => value.trim()).filter(Boolean)
    if (proxies.length === 0) {
        throw trustProxyConfigError('TRUST_PROXY must contain at least one trusted proxy')
    }

    for (const proxy of proxies) {
        if (trustAllValues.has(proxy.toLowerCase())) {
            throw trustProxyConfigError(`TRUST_PROXY must not trust all addresses: ${proxy}`)
        }
        if (!isValidProxy(proxy)) {
            throw trustProxyConfigError(`Invalid TRUST_PROXY entry: ${proxy}`)
        }
    }

    return proxies
}
