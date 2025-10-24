import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import message from "./routes/message.js";

const app = new Hono()

app.route("/api/message", message)


serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
