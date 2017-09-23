const express = require('express')
const validator = require('validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const bcrypt = require('bcryptjs')
const router = new express.Router()

/*
  This file contains api calls for user profile, updateUser, getAllUsers, classes
    /user/profile | GET | Retrives user Information
      Authrization
      Information Expected :
        JWT token
      Returns:
        Fail:
          General err ->
            Boolean | Success | false
            String | err | err message
          authentication failure ->
            Boolean | Success | false
            String | msg | err message
        Success:
          JSON object named user
          user{
            fName,
            lName,
            userName,
            email
          }
     ----------------------------------------------------
     /user/updateUser | POST | Allows client to update user
        Content-Type : application/json
        Infomation Expected:
          id, content to be updated
        Returns:
          Fail:
            General err ->
              Boolean | Success | false
              String | err | err message
          Success:
            Boolean | Success | true
            String | msg | User readable message

*/

// returns user info by token
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: {
    id: req.user._id,
    fName: req.user.fName,
    lName: req.user.lName,
    userName: req.user.username,
    email: req.user.email,
    degree: req.user.degree
  }})
})

router.post('/updateUser', (req, res) => {
  console.log('/updateUser called')
  console.log(req.body)

  var updatedUser = {
    fName: req.body.fName,
    lName: req.body.lName,
    school: req.body.school
  }

  User.updateUser(req.body._id, updatedUser, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false, msg: 'Error occured, fialed to update '})
      console.log('Error occured, fialed to update.')
    } else {
      res.json({success: true, msg: 'Updated '})
      console.log('Updated')
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

module.exports = router
