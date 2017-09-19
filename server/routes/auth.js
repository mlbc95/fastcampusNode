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
            General err ->
              Boolean | Success | false
              String | err | err message
            Query to find username returned name ->
              Boolean | Success | Fail
              String | msg | Username already taken
          Success:
            Boolean | Success | Ture
            String | token | JWT token
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
    ----------------------------------------------------
    /auth/logout | POST | Allows user to logout
     Content-Type : application/json
     Information Expected during logout :
       user id
     Returns:
       Fail:
         Error Message
         String | msg | user friendly message
         String | err | err message
         Boolean | Success | False
       Sucess:
         Boolean | Success | True
         String | msg | user friendly message

*/

// /signup api call
router.post('/signup', (req, res) => {
  // Log to find where we are
  console.log('in signup')
  console.log(req.body)

  // Create new user to pass to function
  var newUser = new User(req.body)

  // Validate the username before checking against the db
  // We do this as CPU time is cheap compared to having to
  // search through records on HD
  User.doesUserNameExist(newUser, (err, user) => {
    // Error handling
    if (err) {
      console.log(err)
      res.json({success: false,
        err: err,
        msg: 'Soemthing went wrong on our end.  Plesae try again.'})
    } else {
      // No error, check to see if the username is taken
      if (user !== '[]') {
        // Means user namename is taken, error out
        let erArray = {}
        erArray.username = 'This username is already taken.  Please choose another.'
        res.json({success: false,
          msg: erArray
        })
      } else {
        // Username is not taken so add new user
        // Have not touched this since before 9/9/17
        User.addUser(newUser, (err, user) => {
          // Handle error
          if (err) {
            console.log(err)
            res.json({success: false,
              err: err})
          } else {
            // Add user and set token
            const token = jwt.sign(newUser, config.secret, {
              expiresIn: 604800 // 1 week
            })
            res.json({success: true,
              token: 'JWT ' + token,
              msg: 'User registered'})
          }
        })
      }
    }
  })
})

// /login Api call taken in a json and if user exists it returns a token
router.post('/login', (req, res) => {
  // Log username and password in the console
  const username = req.body.userName
  const password = req.body.password
  // console.log('username: ', username, 'password: ', password)

  // Check to see if the username exists
  User.getUserByUsername(username, (err, user) => {
    // Log where we are in the api
    console.log('/auth/login API call called')
    // Handle err
    if (err) throw err
    // If the user doesnt exist
    if (!user) {
      // Log info
      console.log('No User Found')
      // Set RFC 7235 401 header info
      res.status(401).setHeader('WWW-Authenticate', 'Basic realm="FASTCampus"')
      // Set app specific info and return
      return res.json({success: false, msg: 'User not found.'})
    }
    // If the user does exist check the password
    User.comparePassword(password, user.password, (err, isMatch) => {
      // Lod where we are
      console.log('compare pass')
      // Handle error
      if (err) throw err
      // If it is a match
      if (isMatch) {
        // Create jwt token
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })
        // create return json and send back to client
        res.status(200).json({
          token: 'JWT ' + token,
          user: {
            id: user._id,
            fName: user.fName,
            lName: user.lName,
            username: user.username,
            email: user.email,

          }
        })
      } else {
        // Set RFC 7235 401 header info
        res.status(401).setHeader('WWW-Authenticate', 'Basic realm="FASTCampus"')
        // Set app specific messages and return to client
        return res.json({success: false, msg: 'Wrong password'})
      }
    })
  })
})

router.post('/logout', (req, res) => {
  // Log for trouble shooting
  console.log('/auth/logout API called')
  // create updatedUser object to pass to User.updateUser
  const updatedUser = {}
  // Set lastLogin date/time to now, MongoDB will handle the conversion from
  // miliseconds after epoch to current time
  updatedUser.lastLogin = Date.now()

  // Pass info to updateUser
  User.updateUser(req.body.id, updatedUser, (err) => {
    // Handle error
    if (err) {
      // Log error for trouble shooting
      console.log(err)
      res.json({success: false,
        err: err,
        msg: 'Soemthing went wrong on our end.  Plesae try again.'})
    } else {
      // Send client success response
      res.json({
        success: true,
        msg: 'Lastlogin updated'
      })
    }
  })
})

module.exports = router
