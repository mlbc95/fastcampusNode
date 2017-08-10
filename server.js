const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')
const PDFParser = require('pdf2json')
const fs = require('fs')
let pdfParser = new PDFParser()

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
const userRoute = require('./server/routes/users')

// list of backend routes in our app 
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)
app.use('/users', userRoute)
// app.use('/updateInfo', updateInfoRoutes)

app.listen(port, () => {
  console.log('Server started on port ' + port)
})

// pdfParser.on('pdfParser_dataError', errData => console.error('PDF Error' + errData.parserError))
// pdfParser.on('pdfParser_dataReady', pdfData => {
//   fs.writeFile('./pdf2json/umslcls.json', JSON.stringify(pdfData.getAllFieldsTypes()))
// })
// pdfParser.loadPDF('./FS17 PDF of Classes.pdf')
