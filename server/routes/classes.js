const express = require('express')
const router = new express.Router()
const lodash = require('lodash')
const fS17Courses = require('../data.json')
const typeCheck = require('type-check').typeCheck

router.get('/allCourses', (req, res, next) => {
  return res.json(fS17Courses)
})

/* 
  This api call loops through all the Courses and addes their names to an array 
  then returns the array as a json object.
  
  /class/fields | get | Returns the list of 
        Content-Type : application/json
        Information Expected
          none
        Returns:
          Fail:
            none
          Success:
            arraylist of Field names ex : [Accounting, .....]
*/
router.get('/fields', (req, res, next) => {
  var fieldList = []
  lodash.forEach(fS17Courses, function (value, key) {
    if (fS17Courses[key].Field !== undefined) {
      fieldList.push(fS17Courses[key].Field)
    }
  })
  return res.json(fieldList)
})

router.get('/getCourse', (req, res, next) => {
  lodash.forEach(fS17Courses, function (value, key) {
    if (fS17Courses[key].Field === req.body.Field) {
      return res.json(fS17Courses[key].Field)
    }
  })
  return res.json({success: false, courseList: 'No courses found for selected Field.'})
})
module.exports = router
