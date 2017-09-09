const express = require('express')
const validator = require('validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const bcrypt = require('bcryptjs')
const router = new express.Router()
const classes = require('../data.json')

/* 
    /user/profile | GET | Retrives user Information 
      Authrization 
      Information Expected : 
        token
      Returns:
        Fail: -> if token is invalid 
          Unauthroized 
        Success: 
          JSON object named user
          user{
            fName,
            lName,
            userName,
            email
          }

*/

// returns user info by token
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: {
    id: req.user._id,
    fName: req.user.fName,
    lName: req.user.lName,
    userName: req.user.username,
    email: req.user.email
  }})
})

router.post('/updateUser', (req, res) => {
  console.log(req.body)

  var updatedUser = {
    fName: req.body.fName,
    lName: req.body.lName,
    school: req.body.school,
    email: req.body.email,
    userName: req.body.userName
  }

  User.updateUser(req.body.id, updatedUser, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false, msg: 'Error occured, fialed to update '})
    } else {
      res.json({success: true, msg: 'Updated '})
    }
  })
})

router.get('/getAllUsers', (req, res) => {
  User.getAllUsers((err, ret) => {
    if (err) {
      console.log('there is an error')
    } else {
      res.json({success: true, data: ret})
    }
  })
})

router.get('/classes', (req, res, next) => {
  return res.json(classes)
})

module.exports = router
