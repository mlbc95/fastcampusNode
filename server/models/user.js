const mongoose = require('mongoose')
const config = require('../../config')
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
    type: String,
    required: true
  }

})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

module.exports.getUserByUsername = function (username, callback) {
  const query = {username: username}
  User.findOne(query, callback)
}

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log('error', err)
    } else {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) { console.log('error', err) }
        newUser.password = hash
        newUser.save(callback)
      })
    }
  })
}
