import { serve } from '@hono/node-server'
import { Hono } from 'hono'

interface MessageText{
  message: string
  color: string
} 

const kvMessage: MessageText = {
  message: 'hello',
  color: '0xff9900'
}

const app = new Hono()

app.get('/', (c) => {
  return c.json(kvMessage)
})

app.post('/api/message', async (c) => {
  const {message, color,} = await c.req.json()
  kvMessage.message = message
  kvMessage.color = color
  return c.json(message,color) 
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
