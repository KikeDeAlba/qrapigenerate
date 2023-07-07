const express = require('express')
const cors = require('cors')
const { generateQR } = require('./src/utils/generateqr')
const path = require('path')
const multer = require('multer')
const https = require('https')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(cors({
    allowedHeaders: '*',
    methods: '*',
    origin: '*'
}))
app.use(express.urlencoded({extended: true}))
app.use('/files', express.static('public'))

const upload = multer().single('file')

app.post('/', upload, async (req, res) => {
    const {url} = req.query
    const file = req.file

    if(typeof url !== 'string' || url === '') return res.status(200).send({success: false})

    let name = Date.now()

    if(file){
        await generateQR(url, path.join(__dirname, `./public/${name}.png`), file.buffer)
    } else {
        await generateQR(url, path.join(__dirname, `./public/${name}.png`))
    }


    return res.status(200).send({
        success: true,
        url: `http://74.208.129.103:3333/files/${name}.png`
    })
})

https.createServer({
    key: fs.readFileSync('ssl.key'),
    cert: fs.readFileSync('ssl.cert'),
}, app).listen(3333, () => {
    console.log('Server started on port 3333')
})