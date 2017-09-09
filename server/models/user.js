const mongoose = require('mongoose')
const config = require('../../config/database')
const bcrypt = require('bcrypt')

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

module.exports = {
  // checks if user's password is correct or not 
  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    })
  },

  // returns information for a specific user 
  getUserByUsername: (username, callback) => {
    const query = {
      username: username
    }
    User.findOne(query, callback)
  },

  // Adds user to the mongoDb
  addUser: (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log('error', err)
      } else {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log('error', err)
          }
          newUser.password = hash
          newUser.save(callback)
        })
      }
    })
  },

  // returns user information by userID
  getUserById: (id, callback) => {
    User.findById(id, callback)
  },

  // Updates user info
  updateUser: (id, updatedUser, callback) => {
    console.log(updatedUser)
    User.findByIdAndUpdate({
      _id: mongoose.Types.ObjectId(id)
    }, updatedUser, callback)
  },

  getAllUsers: (callback) => {
    User.find({}, {
      password: 0,
      _id: 0
    }, callback)
  },

  // --------------------- Classes --------------------------------//

  // Addes class to the user's info 
  addClasses: (id, classes, classback) => {
    console.log(classes)
    User.findByIdAndUpdate({
      _id: mongoose.Types.ObjectId(id),
      classes,
      classback
    })
  }
}

module.exports.getAllUsers = function (callback) {
  User.find({}, {
    password: 0,
    _id: 0
  }, callback)
}
