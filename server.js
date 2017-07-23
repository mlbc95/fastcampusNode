const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')

// Connect To Database
mongoose.connect(config.database)

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database)
})

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})

const port = process.env.PORT || 3001
const app = express()

// tellint the app to look for static files in these directories 
app.use(express.static('.client/public/index.html'))
app.use(express.static('./client/dist'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // <--- Here

// passing the passport middleware
app.use(passport.initialize())

// routes
const authRoutes = require('./server/routes/auth')
const apiRoutes = require('./server/routes/api')
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

app.listen(port, () => {
  console.log('Server started on port ' + port)
})
