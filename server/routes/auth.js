const express = require('express')
const validator = require('validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const bcrypt = require('bcryptjs')
const router = new express.Router()

// Not sure where to put this but it is needed to check error array
function isEmptyObject (obj) {
  return !Object.keys(obj).length
}
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
  const username = req.body.userName
  const password = req.body.password
  // console.log('username: ', username, 'password: ', password)

  User.getUserByUsername(username, (err, user) => {
    console.log('/auth/login API call called')
    if (err) throw err
    if (!user) {
      console.log('No User Found')
      res.status(401)
      res.setHeader('WWW-Authenticate', 'Basic realm="FASTCampus"')
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
        res.status(401)
        res.setHeader('WWW-Authenticate', 'Basic realm="FASTCampus"')
        return res.json({success: false, msg: 'Wrong password'})
      }
    })
  })
})

router.post('/logout', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const updatedUser = {}
  updatedUser.lastLogin = validator.toDate(new Date().getTime() / 1000)
  User.updateUser(req.body._id, updatedUser, (err) => {
    if (err) {
      console.log(err)
      res.json({success: false,
        err: err,
        msg: 'Soemthing went wrong on our end.  Plesae try again.'})
    } else {
      res.json({
        success: true,
        msg: 'Lastlogin updated'
      })
    }
  })
})

module.exports = router
