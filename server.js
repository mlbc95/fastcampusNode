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
const app = express()

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 3001

// tellint the app to look for static files in these directories 
app.use(express.static('.client/public/index.html'))
app.use(express.static('./client/dist'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // <--- Here

require('./config/passport')(passport)
// routes
const authRoutes = require('./server/routes/auth')
const apiRoutes = require('./server/routes/api')
// const updateInfoRoutes = require('./server/routes/updateInfo')

app.use('/auth', authRoutes)
app.use('/api', apiRoutes)
// app.use('/updateInfo', updateInfoRoutes)

app.listen(port, () => {
  console.log('Server started on port ' + port)
})
