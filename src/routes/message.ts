import { Hono } from "hono";
import {html} from "hono/html";

interface MessageText {
    message: string
    color: string
}

const kvMessage: MessageText = {
    message: 'hello',
    color: '0xffffff'
}

const colorSelector = (color: string) => {
    switch (color) {
        case 'red':
            return '0xff0000'
        case 'green':
            return '0x37FD12'
        case 'yellow':
            return '0xFFD500'
        case 'blue':
            return '0x0000ff'
        case 'white':
            return '0xffffff'
        default:
            return '0xffffff'
    }
}

const colorFromHex = (color: string) => {
    switch (color) {
        case '0xff0000':
            return 'red'
        case '0x37FD12':
            return 'green'
        case '0xFFD500':
            return 'yellow'
        case '0x0000ff':
            return 'blue'
        case '0xffffff':
            return 'white'
        default:
            return 'white'
    }
}


const message = new Hono()

message.get('/json', (c) => {
    return c.json(kvMessage)
})

message.post('/new', async (c) => {
    const body = await c.req.json()
    kvMessage.message = body.message
    kvMessage.color = body.color
    return c.json(body)
})

message.get('/new/html', (c) => {
    const color = colorFromHex(kvMessage.color)
    return c.html(html`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>messsage center</title>
    </head>
    <body>
    <div id="currentmessage" class="currentmessage">
        <h1>Message center</h1>
        <p>message: ${kvMessage.message}</p>
        <p>color: ${color}</p>
    </div>
    
    
    <div id="updatemessage" class="updatemessage">
        <form id="messageinfo">
            <p>
                <label for="message">Enter message</label>
                <input type="text" id="message" name="message" value="" required/>
            </p>
            <p>
                <label for="color">color</label>
                <select name="color" id="color" required>
                    <option value="red">red</option>
                    <option value="green">green</option>
                    <option value="yellow">yellow</option>
                    <option value="blue">blue</option>
                    <option value="white">white</option>
                </select>
            </p>
            <input type="submit" value="Submit" />
        </form>
    </div>
    
    
    <script>
        const form = document.querySelector("#messageinfo");

        async function sendData() {
            const formData = new FormData(form);

            try {
                const response = await fetch("https://api.duky.dev/api/message/new/form", {
                    method: "POST",
                    body: formData,
                });
                console.log(await response.json());
            } catch (e) {
                console.error(e);
            }
        }

        // Take over form submission
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            sendData();
            window.location.reload();
        });
    </script>
    
     <style>
        /* Very simple, clean styling for existing elements */
        :root{
            --bg: #f7f8fa;
            --card: #ffffff;
            --muted: #555;
            --border: #e2e6ea;
            --accent: #0b74ff;
        }

        * { box-sizing: border-box; }

        body {
            margin: 32px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            background: var(--bg);
            color: #111;
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }

        .currentmessage, .updatemessage {
            width: 100%;
            max-width: 720px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 6px rgba(16,24,40,0.04);
        }

        .currentmessage h1 {
            margin: 0 0 8px 0;
            font-size: 1.2rem;
        }

        .currentmessage p {
            margin: 4px 0;
            color: var(--muted);
            word-break: break-word;
        }

        form#messageinfo {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
        }

        form#messageinfo p {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        label {
            font-size: 0.95rem;
            color: #222;
        }

        input[type="text"],
        select {
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: #fff;
            font-size: 0.95rem;
        }

        input[type="text"]:focus,
        select:focus {
            outline: none;
            box-shadow: 0 4px 10px rgba(11,116,255,0.08);
            border-color: var(--accent);
        }

        input[type="submit"] {
            padding: 8px 12px;
            border-radius: 6px;
            border: none;
            background: var(--accent);
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            align-self: flex-start;
        }

        input[type="submit"]:hover {
            background: #095ed6;
        }

        @media (min-width: 640px) {
            .currentmessage, .updatemessage {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
            }

            .currentmessage p { margin: 0 8px; }
        }
    </style>
    </body>
    </html>`)
})

message.post('/new/form', async (c) => {
    const body = await c.req.formData()
    const messageTextRaw = body.get('message')
    const colorRaw = body.get('color')

    // Validate presence
    if (messageTextRaw === null || colorRaw === null) {
        return c.json({ error: 'message and color are required' }, 400)
    }

    // Coerce to string (FormDataEntryValue can be string | File)
    const messageText = String(messageTextRaw).trim()
    const colorKey = String(colorRaw)

    // Validate non-empty after trimming
    if (messageText.length === 0) {
        return c.json({ error: 'message cannot be empty' }, 400)
    }

    kvMessage.message = messageText
    kvMessage.color = colorSelector(colorKey)

    return c.json({ message: kvMessage.message, color: kvMessage.color })
})



export default message
