const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('port', process.env.PORT || 3001)

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

// // tell the app to look for static files in these directories
// app.use(express.static('./server/static/'))
// app.use(express.static('./dist/'))
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }))

// routes
const authRoutes = require('./server/routes/auth')
app.use('/auth', authRoutes)

// start the server
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})
