import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import routes from './routes'
import authHandler from './middlewares/auth'

dotenv.config()

const app = express()
app.use(authHandler)
app.use(bodyParser.json())

app.use('/api', routes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
