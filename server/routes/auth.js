const express = require('express')
const validator = require('validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const bcrypt = require('bcryptjs')
const router = new express.Router()

/*
  This file contains api calls for user signup, login and profile information. 
  api calls
      /auth/signup | POST | Allows user to Sign up 
        Content-Type : application/json
        Information Expected 
          fName, lName, email, username, password, shcool, password, degree, year
        Returns: 
          Fail:
            Error Message
            Boolean | Success | True
            String | msg | Faild to user 
            String | err | err msg 
          Success: 
            Boolean | Success | Ture 
            token
            String | msg | User Registered
     ----------------------------------------------------
     /auth/login | POST | Allows user to Login 
      Content-Type : application/json
      Information Expected during login : 
        userName
        password
      Returns: 
        Fail: 
          User not found.
          Wrong password.
        Sucess:
          returns token
*/

// /signup api call 
router.post('/signup', (req, res) => {
  console.log('in signup')
  console.log(req.body)
  var newUser = new User(req.body)

  User.addUser(newUser, (err, user) => {
    if (err) {
      console.log(err)
      res.json({success: false,
        err: err,
        msg: 'Failed to register user'})
    } else {
      const token = jwt.sign(newUser, config.secret, {
        expiresIn: 604800 // 1 week
      })
      res.json({success: true,
        token: 'JWT ' + token,
        msg: 'User registered'})
    }
  })
})

// /login Api call taken in a json and if user exists it returns a token 
router.post('/login', (req, res) => {
  const username = req.body.userName
  const password = req.body.password
  // console.log('username: ', username, 'password: ', password)

  User.getUserByUsername(username, (err, user) => {
    console.log('/auth/login API call called')
    if (err) throw err
    if (!user) {
      console.log('No User Found')
      return res.json({success: false, msg: 'User not found.'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      console.log('compare pass')
      if (err) throw err
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'})
      }
    })
  })
})

module.exports = router
