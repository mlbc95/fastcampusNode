// const express = require('express')
// const bodyParser = require('body-parser')

// const app = express()
// // tell the app to look for static files in these directories
// // app.use(express.static('./build/static/'))
// // app.use(express.static('./build/'))
// // tell the app to parse HTTP body messages
// app.use(bodyParser.urlencoded({ extended: false }))

// // routes
// const authRoutes = require('./server/routes/auth')
// app.use('/auth', authRoutes)

// // start the server
// app.listen(3100, () => {
//   console.log('Server is running on http://localhost:3100 or http://127.0.0.1:3000')
// })

const mongoose = require('mongoose')

module.exports.connect = (uri) => {
  mongoose.connect(uri)
  // plug in the promise library:
  mongoose.Promise = global.Promise

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`)
    process.exit(1)
  })

  // load models
  require('./user')
}
