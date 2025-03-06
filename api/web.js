import express from 'express'
import axios from 'axios'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import {getChannelsList, createChannel} from './ws-server.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const buildPath = path.join(__dirname, 'webchat/build') //../build

app.use(express.static(buildPath))
app.use(express.json())

const PORT = 80
app.use(cors())
app.get('/', (req, res) => {
    // res.sendFile(path.resolve('index.html')) // Отправляем index.html
    res.sendFile(path.join(buildPath, 'index.html'))   
})
app.get('/style.css', (req,res)=>{
	res.sendFile(path.resolve("style.css"))
})

app.get('/getChannels', (req,res) => {
    res.send(getChannelsList())
})
app.post('/createChannel', async (req, res) => {
    const { name, token } = req.body
    if (!name || !token) return res.status(400).json({ error: "All field are required" })

    try {
        console.log("CAPCTHA")
        const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: token
                }
            }
        )

        const { success } = response.data
        console.log(response.data)
        if (!success) return res.status(403).json({ error: "Captcha verify fail" })
        
        
        console.log("Created channel ", name)
        const result = createChannel(name)
        res.status(200).json(result)

    } catch (error) {
        console.error("[RECAPTCHA ERROR]\n", error) 
        return res.status(500)
    }

    
})

app.listen(PORT, () => {
    console.log(`Server working at http://localhost:${PORT}`)
})