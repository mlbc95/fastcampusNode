const mongoose = require('mongoose')
const validator = require('validator')
const lodash = require('lodash')
const typeCheck = require('type-check').typeCheck

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
      courseName: String
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

module.exports.validateCourses = function (tutor, obj) {
  // If the object is present and equal to an array we process further
  if ('courses' in tutor && !lodash.isArray(tutor.courses)) {
    // The object exists but is in an invalid format
    obj.courses = 'Please enter classes in a valid array'
  } else if ('courses' in tutor && lodash.isArray(tutor.courses)) {
    // Is present and in an array loop through array
    lodash.forEach(tutor.courses, function (value) {
      // Loop through object and check values
      lodash.forIn(value, function (key, val) {
        // Switch on key and validate each part
        switch (key) {
          case 'courseNumber':
            if (!typeCheck('Number', value)) {
              obj.courses.courseNumber = 'Please enter a valid number'
              break
            }
            break
          case 'courseName':
            const regex = /((\w+) ?){1,}/
            if (!regex.test(value)) {
              obj.courses.courseName = 'Please enter a valid coursename'
              break
            }
            break
        }
      })
    })
  }
}

module.expotrs.validateAvailable = function (tutor)
