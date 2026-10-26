import {describe, expect, it} from 'vitest'
import express from 'express'
import request from 'supertest'
import {fileURLToPath} from 'node:url'
import securityHeaders from '../middleware/securityHeaders.js'

const app = express()
app.disable('x-powered-by')
app.use(securityHeaders)
app.use(express.static(fileURLToPath(new URL('../../../public/', import.meta.url))))
app.get('/test-json', (_req, res) => res.json({ok: true}))
// Match the production server's JSON 404 instead of Express's default HTML handler.
app.use((req, res) => res.status(404).json({error: 'Not Found', path: req.originalUrl}))

describe('API security headers', () => {
    it.each([['/', 200], ['/test-json', 200], ['/missing', 404]])('protects %s including error responses', async (path, status) => {
        const res = await request(app).get(path)
        expect(res.status).toBe(status)
        const csp = res.headers['content-security-policy']
        expect(csp).toContain("style-src 'self';")
        expect(csp).toContain("font-src 'self';")
        expect(csp).toContain("script-src 'self';")
        expect(csp).toContain("script-src-attr 'none';")
        expect(csp).toContain("frame-ancestors 'self';")
        expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|https:|\*/)
        expect(res.headers['permissions-policy']).toBe('camera=(), microphone=(), geolocation=()')
        expect(res.headers['x-content-type-options']).toBe('nosniff')
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
        expect(res.headers['x-xss-protection']).toBe('0')
        expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains')
        expect(res.headers['x-powered-by']).toBeUndefined()
    })

    it('serves the landing page with a local stylesheet compatible with the policy', async () => {
        const page = await request(app).get('/')
        expect(page.status).toBe(200)
        expect(page.text).not.toMatch(/<style\b|\sstyle\s*=|name=["']generator["']/i)
        const stylesheet = page.text.match(/<link rel='stylesheet' href='([^']+)'/)
        expect(stylesheet).not.toBeNull()
        const css = await request(app).get(`/${stylesheet[1]}`)
        expect(css.status).toBe(200)
        expect(css.headers['content-type']).toContain('text/css')
        expect(css.text).toContain('background-color: #000')
        expect(css.text).toContain('.centered')
    })
})
