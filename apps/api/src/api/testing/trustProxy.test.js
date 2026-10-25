import express from 'express'
import request from 'supertest'
import {describe, expect, it} from 'vitest'
import {getTrustProxyConfig} from '../middleware/trustProxy.js'

function createIpApp(trustProxy) {
    const app = express()
    app.set('trust proxy', trustProxy)
    app.get('/', (req, res) => res.json({ip: req.ip}))
    return app
}

describe('trusted proxy configuration', () => {
    it('trusts only loopback proxies by default', () => {
        expect(getTrustProxyConfig({})).toEqual(['loopback'])
    })

    it('accepts explicit named ranges, IP addresses, and CIDRs', () => {
        expect(getTrustProxyConfig({
            TRUST_PROXY: 'loopback, 10.0.0.8, 192.168.0.0/16, 2001:db8::1'
        })).toEqual(['loopback', '10.0.0.8', '192.168.0.0/16', '2001:db8::1'])
    })

    it('can disable proxy trust explicitly', () => {
        expect(getTrustProxyConfig({TRUST_PROXY: 'false'})).toBe(false)
    })

    it.each([
        '',
        'true',
        '*',
        'all',
        '1',
        '0.0.0.0/0',
        '::/0',
        'proxy.example.com',
        '10.0.0.0/33'
    ])('rejects unsafe or invalid value %j', value => {
        expect(() => getTrustProxyConfig({TRUST_PROXY: value})).toThrow()
    })

    it('uses a forwarded client address when the direct proxy is trusted', async () => {
        const response = await request(createIpApp(getTrustProxyConfig({})))
            .get('/')
            .set('X-Forwarded-For', '203.0.113.20')

        expect(response.body.ip).toBe('203.0.113.20')
    })

    it('ignores a forwarded address when proxy trust is disabled', async () => {
        const response = await request(createIpApp(false))
            .get('/')
            .set('X-Forwarded-For', '203.0.113.20')

        expect(response.body.ip).not.toBe('203.0.113.20')
    })
})
