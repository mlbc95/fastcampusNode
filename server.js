const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config')

// Connectin to the database and loading modles 
require('./server/models').connect(config.dbUri)

const app = express()

app.set('port', process.env.PORT || 3001)

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

// tellint the app to look for static files in these directories 
app.use(express.static('.client/public/index.html'))
app.use(express.static('./client/dist'))

// // tell the app to look for static files in these directories
// app.use(express.static('./server/static/'))
// app.use(express.static('./dist/'))
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }))

// passing the passport middleware
app.use(passport.initialize())

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

app.use(allowCrossDomain)
// loaiding passport strategies 
const localSignupStrategy = require('./server/passport/local-signup')
const localLoginStrategy = require('./server/passport/local-login')

passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

// routes
const authRoutes = require('./server/routes/auth')
const apiRoutes = require('./server/routes/api')
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

// start the server
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})
