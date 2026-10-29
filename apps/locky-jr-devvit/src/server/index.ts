
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import {
  createServer,
  getServerPort,
  reddit
} from '@devvit/web/server'

import { sendModMailToWebhook } from './modmailToDiscord.js'

const app = new Hono()

app.post('/internal/triggers/modmail', async (c) => {
  console.log('ModMail endpoint invoked')

  try {
    const event = await c.req.json()

    console.log('ModMail event:', JSON.stringify(event))

    await sendModMailToWebhook(event, reddit)

    return c.json({ status: 'ok' })
  } catch (error) {
    console.error('ModMail processing failed:', error)
    return c.json({ status: 'error' }, 500)
  }
})

serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort()
})
