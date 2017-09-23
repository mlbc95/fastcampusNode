const mongoose = require('mongoose')

const ClassSchema = mongoose.Schema({
  subject: {
    type: String
  },
  courseNumber: {
    type: String
  },
  className: {
    type: String
  },
  classes: [{
    crn: {
      type: String
    },
    section: {
      type: String
    },
    time: {
      type: String
    },
    professor: {
      type: String
    }
  }]
})
const classes = module.exports = mongoose.model('classes', ClassSchema)

// returns user information by userID
module.exports.getClassById = function (id, callback) {
  classes.findById(id, callback)
}
