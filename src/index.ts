import { serve } from '@hono/node-server'
import { Hono } from 'hono'

interface MessageText{
  message: string
} 

const kvMessage: MessageText = {
  message: 'hello'
}

const app = new Hono()

app.get('/', (c) => {
  return c.json(kvMessage)
})

app.post('/api/message', async (c) => {
  const {message} = await c.req.json()
  kvMessage.message = message
  return c.json(message) 
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
