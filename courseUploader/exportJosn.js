const firebase = require('firebase')
const fs = require('fs')
const _ = require('lodash')
const jsonfile = require('jsonfile')
let config = {
  apiKey: 'AIzaSyBlRJNAlt0gbxy40J0NUERhxDyR9m89ANU',
  authDomain: 'fastcampusdb.firebaseapp.com',
  databaseURL: 'https://fastcampusdb.firebaseio.com',
  projectId: 'fastcampusdb',
  storageBucket: 'fastcampusdb.appspot.com',
  messagingSenderId: '68292272608'
}

firebase.initializeApp(config)
const db = firebase.database()
const rootRef = db.ref()
const courseRef = rootRef.child('courses')

fs.readFile('./data.json', (err, data) => {
  if (err) throw err
  let obj = JSON.parse(data)
  _.forEach(obj, (subject) => {
    const subjectRef = courseRef.child(subject.subject.toLowerCase().replace(/ /g, '_'))
    _.forEach(subject.courses, (course) => {
      const individualCourseRef = subjectRef.child(course.courseNumber)
      individualCourseRef.set({name: course.courseName})

      _.forEach(course.classes, (section) => {
        const sectionRef = individualCourseRef.child('sections/' + section.section)
        sectionRef.set({crnNumber: section.crnNumber, time: section.time, professor: section.professor}).then()
        // courseRef.child(section.crnNumber).set({subject: subject.subject, name: course.courseName, number: course.courseNumber, time: section.time, professor: section.professor})
      })
    })
  })
})
