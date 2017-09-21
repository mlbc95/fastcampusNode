const express = require('express')
const Tutor = require('../models/tutor.js')
const lodash = require('lodash')
const router = new express.Router()
const typeCheck = require('type-check').typeCheck
const validator = require('validator')
/*
  This file contains api calls for Tutor
*/

router.post('/', (req, res) => {
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

router.put('/', (req, res) => {
  const errObj = {}
  const updatedTutor = {}
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
  console.log(errObj)
  if (lodash.isEmpty(errObj)) {
    console.log('empty')
    Tutor.updateTutor(req.body._id, updatedTutor, (err) => {
      // Handle error
      if (!lodash.isEmpty(err)) {
        console.log(err)
        res.json({success: false, msg: 'Failed to udpate tutor', err: err})
      }
      res.json({success: true, msg: 'Updated tutor'})
    })
  } else {
    res.json({success: false, msg: errObj, test: 'here'})
  }
})

router.get('/', (req, res) => {
  if (req.query.id && validator.isMongoId(req.query.id)) {
    Tutor.getTutorById(req.query.id, (err, ret) => {
      if (err) {
        console.log(err)
        res.json({success: false})
      } else {
        console.log(ret)
        res.json({success: true, msg: ret})
      }
    })
  } else {
    Tutor.getAllTutors((err, ret) => {
      if (err) {
        console.log(err)
        res.json({success: false})
      } else {
        res.json({success: true, msg: ret})
      }
    })
  }
})
module.exports = router
