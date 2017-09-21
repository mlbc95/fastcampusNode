const express = require('express')
const Tutor = require('../models/tutor.js')
const lodash = require('lodash')
const router = new express.Router()
const typeCheck = require('type-check').typeCheck
/*
  This file contains api calls for Tutor
*/

router.post('/addTutor', (req, res) => {
  const errObj = {}
  Tutor.addTutorValidationWrapper(req.body, errObj, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false})
    }
    if (lodash.isEmpty(errObj)) {
      Tutor.addTutor(req.body, (err) => {
        if (err) {
          console.log(err)
          res.json({success: false})
        }
        res.json({success: true, msg: req.body})
      })
    }
  })
})

router.post('/updateTutor', (req, res) => {
  const errObj = {}
  const updatedTutor = {}
  lodash.foIn(req.body, function (val, key) {
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
})
module.exports = router
