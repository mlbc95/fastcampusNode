const express = require('express')
const validator = require('validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config/database')
const bcrypt = require('bcryptjs')
const router = new express.Router()

router.post('/signup', (req, res) => {
  console.log('in signup')
  console.log(req.body)
  var newUser = new User(req.body)

  User.addUser(newUser, (err, user) => {
    if (err) {
      console.log(err)
      res.json({success: false, msg: 'Failed to register user'})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })
})

router.post('/login', (req, res) => {
  const username = req.body.userName
  const password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    console.log('get user')
    if (err) throw err
    if (!user) {
      console.log('no user')
      return res.json({success: false, msg: 'User not found'})
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
// returns user info by token
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

module.exports = router
