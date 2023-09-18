import express from 'express'

const app = express()
const PORT = 3001

app.get('/', (req, res) => {
    res.send('Mock Certificateless Crypto Service')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
