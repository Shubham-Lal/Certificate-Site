require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin.js')
const publicRoutes = require('./routes/public.js')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.static(path.join(__dirname, './public')))

app.use('/api/admin/', adminRoutes)
app.use('/api/public/', publicRoutes)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Certificate Site API',
            version: '1.0.0'
        }
    },
    apis: ['./routes/*.js']
}
const specs = swaggerJsdoc(options)
app.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        customSiteTitle: 'Certificate Site API',
        customfavIcon: 'favicon.ico',
        customCssUrl: ['swagger.css']
    })
)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Listening for requests on port: ${PORT}`)))
    .catch(err => console.log(`MongoDB connection error: ${err}`))