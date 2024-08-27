require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admin.js')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use('/api/admin/', adminRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Listening for requests on port: ${PORT}`)))
    .catch(err => console.log(`MongoDB connection error: ${err}`))