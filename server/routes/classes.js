const express = require('express')
const router = new express.Router()
const lodash = require('lodash')
const fS17Courses = require('../data.json')

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
            arraylist of field names ex : [Accounting, .....]
*/
router.get('/fields', (req, res, next) => {
  var fieldList = []
  lodash.forEach(fS17Courses, function (value, key) {
    if (fS17Courses[key].field !== undefined) {
      fieldList.push(fS17Courses[key].field)
    }
  })
  return res.json(fieldList)
})

/*
  This get takes in a header field with a field name and returns list of courses for that field
   /class/fields | get | Returns the list of 
        Content-Type : application/json
        Information Expected
          field ex: field : Accounting in the req header
        Returns:
          Fail:
            if req is empty 
              {success: false, courseList: 'No course Selected'}
            if type in filed
              {success: false, courseList: 'No courses found for selected field.'}
          Success:
            {sucess: true, courseList: {"courseNumber" : ....}}
*/
router.get('/getCourse', (req, res, next) => {
  if (!req.get('field')) {
    return res.json({success: false, courseList: 'No course Selected'})
  }
  var sent = false
  lodash.forEach(fS17Courses, function (value, key) {
    if (fS17Courses[key].field === req.get('field')) {
      sent = true
      return res.json({sucess: true, courseList: fS17Courses[key].courses})
    }
  })
  if (!sent) {
    return res.json({success: false, courseList: 'No courses found for selected field.'})
  }
})
module.exports = router
