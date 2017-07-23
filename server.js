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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // <--- Here

// passing the passport middleware
app.use(passport.initialize())

// var allowCrossDomain = function (req, res, next) {
//   res.setHeader('Content-type', 'application/json')
//   // intercept OPTIONS method
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200)
//   } else {
//     next()
//   }
// }

// routes
const authRoutes = require('./server/routes/auth')
const apiRoutes = require('./server/routes/api')
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

// start the server
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})
