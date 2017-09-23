const express = require('express')
const router = new express.Router()
const fS17Courses = require('../data.json')

router.get('/allCourses', (req, res, next) => {
  return res.json(fS17Courses)
})

router.get('/fields', (req, res, next) => {

})
module.exports = router
