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

fs.readFile('./output.txt', (err, data) => {
  if (err) throw err
  let obj = JSON.parse(data)
  _.forIn(obj, (courses, subjectName) => {
    const subjectRef = courseRef.push({name: subjectName});
    _.forIn(courses, (course, courseNumber) => {
      console.log(courseNumber);
      const individualCourseRef = subjectRef.child(courseNumber)
      individualCourseRef.set({name: course.name})
      _.forEach(course.sections, (section, sectionName) => {
          if (!_.isEmpty(section)) {
            const sectionRef = individualCourseRef.child('sections/' + sectionName)
            sectionRef.set({crnNumber: section.crnNumber|"1", time: section.time, professor: section.professor, day: section.day, building: section.building}).then()
            // courseRef.child(section.crnNumber).set({subject: subject.subject, name: course.courseName, number: course.courseNumber, time: section.time, professor: section.professor})
          }
      })
    })
  })
})
