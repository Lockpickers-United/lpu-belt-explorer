import {describe, it, expect, beforeAll} from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import securityHeaders from '../api/middleware/securityHeaders.js'
import {httpLogger} from '../logger/httpLogger.js'
import {requestIdHeader} from '../logger/requestId.js'
import {registerRoutes} from '../routes.js'

// Recreate the DEV server stack as-is without calling app.listen()
function createDevLikeApp() {
  const app = express()

  // DEV normalization middleware (preserve query string and normalize originalUrl)
  app.use((req, _res, next) => {
    const before = req.url
    if (typeof before === 'string' && before.includes('//')) {
      const [pathPart, queryPart] = before.split('?', 2)
      const normalizedPath = pathPart.replace(/\/{2,}/g, '/')
      const after = queryPart ? `${normalizedPath}?${queryPart}` : normalizedPath
      if (after !== before) {
        req.url = after
        if (typeof req.originalUrl === 'string') {
          const [oPath, oQuery] = req.originalUrl.split('?', 2)
          const oNorm = oPath.replace(/\/{2,}/g, '/')
          req.originalUrl = oQuery ? `${oNorm}?${oQuery}` : oNorm
        }
      }
    }
    next()
  })

  app.disable('etag')
  app.disable('x-powered-by')
  app.use(securityHeaders)
  app.use(express.json({ limit: '200kb' }))
  app.set('trust proxy', true)
  app.use(httpLogger)
  app.use(requestIdHeader)

  const corsOrigin = true // mirrors DEV default when CORS_ORIGIN absent
  app.use(cors({ origin: corsOrigin, credentials: true }))

  // DEV mounts at both /servicesDev and root
  registerRoutes(app, { prefix: '/servicesDev' })
  registerRoutes(app, { prefix: '' })
  return app
}

let app
beforeAll(() => {
  process.env.NODE_ENV = 'test'
  delete process.env.CORS_ORIGIN // let cors behave with default
  app = createDevLikeApp()
})

describe('DEV server basic endpoints', () => {
  it('GET /servicesDev/ready → 200 {ready:true}', async () => {
    const res = await request(app).get('/servicesDev/ready')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ready: true })
  })

  it('GET /ready (prefix stripped by proxy) → 200 {ready:true}', async () => {
    const res = await request(app).get('/ready')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ready: true })
  })
})

describe('URL normalization', () => {
  it('collapses multiple slashes inside and after the prefix', async () => {
    const res = await request(app).get('//servicesDev///ready')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ready: true })
  })

  it('preserves query strings when normalizing', async () => {
    const res = await request(app).get('//servicesDev///health?x=1&&y=2')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})

describe('headers and logging helpers', () => {
  it('echoes request origin in CORS when credentials are enabled', async () => {
    const origin = 'https://example.test'
    const res = await request(app)
      .get('/servicesDev/ready')
      .set('Origin', origin)
    // With cors({ origin: true, credentials: true }), origin is echoed
    expect(res.headers['access-control-allow-origin']).toBe(origin)
    expect(res.headers['access-control-allow-credentials']).toBe('true')
  })

  it('adds a request id header when none is supplied', async () => {
    const res = await request(app).get('/ready')
    const reqId = res.headers['x-request-id'] || res.headers['x-correlation-id']
    expect(reqId).toBeTruthy()
  })

  it('preserves inbound x-request-id if provided', async () => {
    const inbound = 'abc-123-fixed-id'
    const res = await request(app).get('/ready').set('x-request-id', inbound)
    const out = res.headers['x-request-id'] || res.headers['x-correlation-id']
    expect(out).toBe(inbound)
  })
})

describe('validation and error handling routes', () => {
  it('POST /servicesDev/echo validates body (400 on invalid)', async () => {
    const res = await request(app)
      .post('/servicesDev/echo')
      .send({ })
      .set('Content-Type', 'application/json')
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('invalid_body')
  })

  it('POST /echo returns DEV suffix', async () => {
    const res = await request(app)
      .post('/echo')
      .send({ message: 'hello' })
      .set('Content-Type', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.echo).toBe('hello (DEV)')
  })

  it('GET /boom surfaces 500', async () => {
    const res = await request(app).get('/boom')
    expect(res.status).toBe(500)
  })
})
