const mongoose = require('mongoose')
const config = require('../../config/database')
const bcrypt = require('bcrypt')
var moment = require('moment')

var date = new Date()

// User Schema
const UserSchema = mongoose.Schema({
  fName: {
    type: String
  },
  lName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  school: {
    type: String,
    required: true

  },
  password: {
    type: String,
    required: true
  },
  pNumber: {
    type: String
  },
  year: {
    type: String
  },
  degree: [{
    type: String,
    name: String
  }],
  classes: [ // course registration number 
    {
      courseNumber: Number,
      className: String,
      crnNum: Number,
      section: Number,
      timeIn: Date,
      timeOut: Date,
      professor: String
    }
  ],
  lastLogin: {
    type: Date
  }

})

const User = module.exports = mongoose.model('User', UserSchema)

// checks if user's password is correct or not 
module.exports.comparePassword = function (candidatePassword, hash, user, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      callback(null, !isMatch)
    }
    if (isMatch) {
      // var currentTime = moment.now()

      User.findByIdAndUpdate({_id: mongoose.Types.ObjectId(user._id)}, {lastLogin: new Date()}, callback)
    }
  })
}

module.exports.getAllUsers = function (callback) {
  User.find({}, {
    password: 0,
    _id: 0
  }, callback)
}
