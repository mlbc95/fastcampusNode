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
            slot: String
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
  console.log('in lname validator')
  // If the lName is in user object and doesnt pass the regex test
  if ('lName' in tutor && !validator.isAlpha(tutor.lName.trim())) {
    // Insert failure logic
    obj.lName = 'Please enter a valid last name'
  } else {
    // Clean up last name
  }
}

module.exports.validateCourses = function (tutor, obj) {
  console.log('in course validator')
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

module.exports.validateAvailable = function (tutor, obj) {
  console.log('in available validator')
  // If the object is present and equal to an array we process further
  if ('available' in tutor && !lodash.isArray(tutor.available)) {
    // The object exists but is in an invalid format
    obj.available = 'Please enter classes in a valid array'
  } else if ('available' in tutor && lodash.isArray(tutor.available)) {
    // Is present and in an array loop through array
    lodash.forEach(tutor.availavle, function (value) {
      // Get the day of the week to manipulate the value
      lodash.forIn(value, function (key, val) {
        // Make sure key is set properly
        if (key === 'dayOfWeek') {
          // validate day against days of the week
          const regex = /([Ss]unday|[Mm]onday|[Tt]uesday|[Ww]ednesday|[Tt]hursday|[Ff]riday|[Ss]aturday)/
          if ('day' in val && !regex.test(val.day)) {
            // Day of week was entered inproperly
            obj.available.dayOfWeek.day = 'Please enter a valid day of week'
          } else if ('day' in val && regex.test(val.day)) {
            // Passed validation for day, now validate hours
            lodash.forIn(val.hours, function (k, v) {
              // Regex forces 3 or 4 numbers, dash, 3 or 4 numbers
              const regex1 = /\d{3,4}[-]\d{3,4}/
              if (!regex1.test(v)) {
                obj.available.dayOfWeek.hours = 'please enter a valid time'
              }
            })
          }
        }
      })
    })
  }
}

module.exports.validateOffice = function (tutor, obj) {
  console.log('in office validator')
  if ('office' in tutor && !lodash.isObject(tutor.office)) {
    // Error as the office is not an object
    obj.office = 'Please enter the office in a valid format'
  } else if ('office' in tutor && lodash.isObject(tutor.office)) {
    const regex = /((\w+) ?){1,}/
    const regex1 = /[A-Z]?\d{1,5}/
    // If building and roomNumber are present but do not match the regex
    if ('building' in tutor.office &&
        'roomNumber' in tutor.office &&
        !regex.test(tutor.office.building) &&
        !regex1.test(tutor.office.roomNumber)) {
      // Error as the office is not an object
      obj.office = 'Please enter the office in a valid format'
    }
  }
}

module.exports.validateSchool = function (tutor, obj) {
  console.log('in school validator')
  const regex = /\w+/
  if ('school' in tutor && !regex.test(tutor.school)) {
    obj.scool = 'Please enter a valid school'
  }
}
module.exports.addTutorValidationWrapper = function (tutor, obj, callback) {
  Tutor.validateFName(tutor, obj)
  Tutor.validateLName(tutor, obj)
  Tutor.validateCourses(tutor, obj)
  Tutor.validateAvailable(tutor, obj)
  Tutor.validateOffice(tutor, obj)
  Tutor.validateSchool(tutor, obj)
  callback()
}

// CRUD operations
module.exports.addTutor = function (newTutor, callback) {
  const obj = new Tutor(newTutor)
  obj.save()
  newTutor._id = obj._id
  callback()
}

module.exports.updateTutor = function (id, updatedTutor, callback) {
  console.log(updatedTutor)
  Tutor.findByIdAndUpdate({_id: mongoose.Types.ObjectId(id)}, updatedTutor, callback)
}

module.exports.getTutor = function (id, callback) {
  Tutor.findById(id, callback)
}
