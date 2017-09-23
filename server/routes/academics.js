const express = require('express')
// const validator = require('validator')
const passport = require('passport')
// const jwt = require('jsonwebtoken')
// const User = require('../models/user')
// const config = require('../../config/database')
const router = new express.Router()

// Middleware for now, this will later be use to authenticate the calls coming in to 
// the path /academ

router.post('/addDegree', (req, res) => {
  console.log('/addDegree')
})

router.post('/addClasses', (req, res) => {
  console.log('Adding classes')
  console.log(req.body)
})

router.get('getClasses', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: {
    year: req.user.year,
    degree: req.user.degree,
    classses: req.user.classses
  }})
})

module.exports = router
