import express from 'express'
import request from 'supertest'
import {describe, expect, it} from 'vitest'
import {registerRoutes, shouldEnableDiagnosticRoutes} from '../routes.js'

function createApp({enableDiagnosticRoutes}) {
    const app = express()
    app.use(express.json())
    registerRoutes(app, {prefix: '/services', enableDiagnosticRoutes})
    registerRoutes(app, {prefix: '', enableDiagnosticRoutes})
    app.use((error, _req, res, _next) => {
        res.status(error.status || 500).json({error: error.message})
    })
    return app
}

describe('testing route production gate', () => {
    it('enables diagnostic routes only outside production', () => {
        expect(shouldEnableDiagnosticRoutes('production')).toBe(false)
        expect(shouldEnableDiagnosticRoutes('development')).toBe(true)
        expect(shouldEnableDiagnosticRoutes('test')).toBe(true)
    })

    it.each(['/health', '/services/health'])(
        'keeps the health probe available at %s when diagnostics are disabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: false})).get(route)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({ok: true})
        }
    )

    it.each(['/ready', '/services/ready'])(
        'keeps the readiness probe available at %s when diagnostics are disabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: false})).get(route)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({ready: true})
        }
    )

    it.each(['/echo', '/services/echo'])(
        'does not mount the echo route at %s when diagnostics are disabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: false}))
                .post(route)
                .send({message: 'hello'})

            expect(response.status).toBe(404)
        }
    )

    it.each(['/boom', '/services/boom'])(
        'does not mount the error route at %s when diagnostics are disabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: false})).get(route)

            expect(response.status).toBe(404)
        }
    )

    it.each(['/echo', '/services/echo'])(
        'mounts the echo route at %s when diagnostics are enabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: true}))
                .post(route)
                .send({message: 'hello'})

            expect(response.status).toBe(200)
            expect(response.body.echo).toBe('hello (DEV)')
        }
    )

    it.each(['/boom', '/services/boom'])(
        'mounts the error route at %s when diagnostics are enabled',
        async route => {
            const response = await request(createApp({enableDiagnosticRoutes: true})).get(route)

            expect(response.status).toBe(500)
            expect(response.body).toEqual({error: 'kaboom'})
        }
    )
})
