const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')
var swaggerTools = require('swagger-tools')
var YAML = require('yamljs')
var swaggerDoc = YAML.load('openapi.yaml')
// const PDFParser = require('pdf2json')
// const fs = require('fs')
// let pdfParser = new PDFParser()

mongoose.Promise = global.Promise
// Connect To Database
// ued useMOngoClient | keep Alive | reconnectTries to solve depracation warning and open Uri warning
mongoose.connect(config.database, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
})

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo Database: ' + config.database)
})

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})
const app = express()

// Allow CORS
app.use(function (req, res, next) {
  console.log(req.body)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi())
})

const port = process.env.PORT || 3000

// tellint the app to look for static files in these directories
app.use(express.static('.client/public/index.html'))
app.use(express.static('./client/dist'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // <--- Here

require('./config/passport')(passport)

// routes
const authRoutes = require('./server/routes/auth') // /login /signup /profile
const academicRoutes = require('./server/routes/academics')
const apiRoutes = require('./server/routes/api')
const userRoute = require('./server/routes/users')
const classesRoute = require('./server/routes/classes.js')

// to push
// list of backend routes in our app
app.use('/auth', authRoutes)
app.use('/academ', academicRoutes)
app.use('/api', apiRoutes)
app.use('/users', userRoute)
app.use('/class', classesRoute)
// app.use('/updateInfo', updateInfoRoutes)

app.listen(port, () => {
  console.log('Server started on port ' + port)
})

// pdfParser.on('pdfParser_dataError', errData => console.error('PDF Error' + errData.parserError))
// pdfParser.on('pdfParser_dataReady', pdfData => {
//   fs.writeFile('./pdf2json/umslcls.json', JSON.stringify(pdfData.getAllFieldsTypes()))
// })
// pdfParser.loadPDF('./FS17 PDF of Classes.pdf')
