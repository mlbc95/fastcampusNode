const mongoose = require('mongoose')

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
  classes: [ // classes available to tutor
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
  hours: [
    {
      type: String
    }
  ],
  office: {
    building: String,
    roomNumber: String
  }
})

const Tutor = module.exports = mongoose.model('Tutor', TutorSchema)
