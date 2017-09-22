const express = require('express')
const router = new express.Router()
const classes = require('../data.json')

router.get('/classes', (req, res, next) => {
  return res.json(classes)
})
module.exports = router
