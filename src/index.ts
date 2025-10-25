import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import { basicAuth } from 'hono/basic-auth'
import message from "./routes/message.js";

const app = new Hono()

const  authUser = process.env.USERNAME || 'admin'
const authPassword = process.env.USER_PASSWORD || 'admin'
console.log(authUser)

app.get("/", async (c) => {
    return c.text("Hello World!");
})

app.use(
    '/api/*',
    basicAuth({
        username: authUser,
        password: authPassword,
    })
)
app.route("/api/message", message)


serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
