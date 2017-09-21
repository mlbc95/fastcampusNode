const express = require('express')
const Tutor = require('../models/tutor.js')
const lodash = require('lodash')
const router = new express.Router()
const typeCheck = require('type-check').typeCheck
const validator = require('validator')
/*
  This file contains api calls for Tutor
  /tutor/ | POST | Adds tutor to the db
  Information expected:
    Tutor object
  Returns:
    Fail:
      General failure ->
        Boolean | Success | false
        String | err | err message
      Validation failure ->
        Boolean | success | false
        JSON | err | errObj containing errors
        JSON | oldBody | the old request to repopulate the fields
    Success:
      Boolean | success | true
      JSON | msg | object with id inserted

  /tutor/ | PUT | updates tutor information
  Infomation expected:
    id of the tutor to update
    information to be updated in JSON format
  Returns:
    Fail:
      General failure ->
        Boolean | Success | false
        String | err | err message
      Validation failure ->
        Boolean | success | false
        JSON | err | errObj containing errors
        JSON | oldBody | old request to repopulate fields
    Success:
      Boolean | success | true
      String | msg | 'Tutor has successfully updated'

  /tutor/ | GET | gets either an individual tutor or all of them
  Information expected:
    id of the tutor to retrive (OPTIONAL)
  Returns:
    Fail:
      General failure ->
        Boolean | Success | false
        String | err | err message
      Bad mongo ID ->
        Boolean | success | false
        String | msg | 'Please user valid mongo id'
    Success:
      If ID was present ->
        Boolean | success | true
        JSON | msg | tutor object
      If ID was not present ->
        Boolean | success | true
        JSON | msg | array of tutors
*/

router.post('/', (req, res) => {
  // Create error object to pass to validation wrapper
  const errObj = {}

  // pass tutor object and error object to validation wrapper
  Tutor.addTutorValidationWrapper(req.body, errObj, (err) => {
    // Handle an error if we have one
    if (err) {
      console.log(err)
      res.json({success: false, err: err})
    }
    // Check to make sure validation passed
    if (lodash.isEmpty(errObj)) {
      // If we passed
      Tutor.addTutor(req.body, (err) => {
        // Handle errors
        if (err) {
          console.log(err)
          res.json({success: false})
        }
        // Adding the tutor was successful, send message to front end
        res.json({success: true, msg: req.body})
      })
    } else {
      // We had errors in validation, pass info back to front end
      res.json({success: false, err: errObj, oldBody: req.body})
    }
  })
})

// Updates the user
router.put('/', (req, res) => {
  // Create objects to pass to function calls
  const errObj = {}
  const updatedTutor = {}

  // Loop through req.body and validate present items
  // Logic of the switch
  //    if the key is present ->
  //      send to validation
  //      if key is present in error object break and dont add to update
  //      else add to update
  lodash.forIn(req.body, function (val, key) {
    switch (key) {
      case 'fName':
        Tutor.validateFName(req.body, errObj)
        if ('fName' in errObj) {
          break
        }
        updatedTutor.fName = val
        break
      case 'lName':
        Tutor.validateLName(req.body, errObj)
        if ('lName' in errObj) {
          break
        }
        updatedTutor.lName = val
        break
      case 'school':
        Tutor.validateSchool(req.body, errObj)
        if ('school' in errObj) {
          break
        }
        updatedTutor.school = val
        break
      case 'walkIn':
        if (!typeCheck('Boolean', val)) {
          errObj.walkIn = 'Please enter a boolean value for walkIn'
          break
        }
        updatedTutor.walkIn = val
        break
      case 'appointment':
        if (!typeCheck('Boolean', val)) {
          errObj.appointment = 'Please enter a valid value for appointment'
          break
        }
        updatedTutor.appointment = val
        break
      case 'available':
        Tutor.validateAvailable(req.body, errObj)
        if ('available' in errObj) {
          break
        }
        updatedTutor.available = val
        break
      case 'office':
        Tutor.validateOffice(req.body, errObj)
        if ('office' in errObj) {
          break
        }
        updatedTutor.office = val
        break
    }
  })
  // Log the error object for trouble shooting
  console.log(errObj)
  // Check to see if the errObj is empty
  if (lodash.isEmpty(errObj)) {
    // If it is empty log so and move onto update
    console.log('empty')
    Tutor.updateTutor(req.body._id, updatedTutor, (err) => {
      // Handle error
      if (!lodash.isEmpty(err)) {
        console.log(err)
        res.json({success: false, msg: 'Failed to udpate tutor', err: err})
      }
      // Send success response
      res.json({success: true, msg: 'Updated tutor'})
    })
  } else {
    // Validation failed, send message to front end
    res.json({success: false, msg: errObj, oldBody: req.body})
  }
})

// Gets the tutors from the DB
router.get('/', (req, res) => {
  // If the id is present in the query and it is a mongoid
  if (req.query.id && validator.isMongoId(req.query.id)) {
    // Query the db and get the tutor by id
    Tutor.getTutorById(req.query.id, (err, ret) => {
      // Handle erross
      if (err) {
        console.log(err)
        res.json({success: false})
      } else {
        // Success, send response to front end
        console.log(ret)
        res.json({success: true, msg: ret})
      }
    })
  } else if (req.query.id && !validator.isMongoId(req.query.id)) {
    // If it is not a valid mongo id
    res.json({success: false, msg: 'Please use valid mongo id'})
  } else {
    // There was no id present, request is after all tutors
    Tutor.getAllTutors((err, ret) => {
      // Handle errors
      if (err) {
        console.log(err)
        res.json({success: false})
      } else {
        // Query succeeded, send response to frontend
        res.json({success: true, msg: ret})
      }
    })
  }
})
module.exports = router
