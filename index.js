import express from 'express'
import cors from 'cors'
import qr from 'qrcode'

const app = express()

app.use(express.json())
app.use(cors({
    allowedHeaders: '*',
    methods: '*',
    origin: '*'
}))
app.use('/files', express.static('public'))

app.get('/', (req, res) => {
    const {url} = req.query

    if(typeof url !== 'string') return res.status(200).send({success: false})

    qr.toFile('./public/qr.png', url, {
        width: 500
    })

    return res.status(200).send({
        success: true,
        url: 'http://74.208.129.103:3333/files/qr.png'
    })
})

app.listen(3333, () => {
    console.log('Server started on port 3333')
})