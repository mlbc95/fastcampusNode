const mongoose = require('mongoose')
const validator = require('validator')
const lodash = require('lodash')

const TutorSchema = mongoose.Schema({
  fName: {
    type: String
  },
  lName: {
    type: String
  },
  school: {
    type: String,
    required: true
  },
  courses: [ // classes available to tutor
    {
      courseNumber: Number,
      className: String
    }
  ],
  walkIn: {
    type: Boolean
  },
  appointment: {
    type: Boolean
  },
  available: [
    {
      dayOfWeek: {
        day: String,
        hours: [
          {
            type: String
          }
        ]
      }
    }
  ],
  office: {
    building: String,
    roomNumber: String
  }
})

const Tutor = module.exports = mongoose.model('Tutor', TutorSchema)

module.exports.validateFName = function (tutor, obj) {
  console.log('in first name validator')
  // If the fName is in the object AND doesnt pass the regex test
  if ('fName' in tutor && !validator.isAlpha(tutor.fName.trim())) {
    // Insert failure return message for processing by frontend
    obj.fName = 'Please enter a valid first name'
  } else {
    // Clean up fname
  }
}

module.exports.validateLName = function (tutor, obj) {
  // If the lName is in user object and doesnt pass the regex test
  if ('lName' in tutor && !validator.isAlpha(tutor.lName.trim())) {
    // Insert failure logic
    obj.lName = 'Please enter a valid last name'
  } else {
    // Clean up last name
  }
}
